from rest_framework import viewsets, permissions, status, generics, serializers, decorators
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, StudentProfile, Menu, Attendance, Bill
from .serializers import UserSerializer, StudentProfileSerializer, MenuSerializer, AttendanceSerializer, BillSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add custom role validation
        role = self.initial_data.get('role')
        if role == 'student':
            if not self.user.is_student:
                raise serializers.ValidationError("Access denied. Not a student account.")
        elif role == 'staff':
            if not self.user.is_staff_member:
                raise serializers.ValidationError("Access denied. Not a staff account.")
        
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff_member:
            return StudentProfile.objects.all()
        return StudentProfile.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

from .permissions import IsStaffOrReadOnly

class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    permission_classes = [IsStaffOrReadOnly]
    # In a real app, restrict modify to staff

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
         user = self.request.user
         queryset = Attendance.objects.none()
         
         if user.is_staff_member:
             queryset = Attendance.objects.all()
             # Allow filtering by specific student for history view
             student_id_param = self.request.query_params.get('student_id')
             if student_id_param:
                 queryset = queryset.filter(student__user__id=student_id_param)
         elif hasattr(user, 'studentprofile'):
             queryset = Attendance.objects.filter(student=user.studentprofile)
             
         date_param = self.request.query_params.get('date')
         if date_param:
             queryset = queryset.filter(date=date_param)
             
         return queryset

    def perform_create(self, serializer):
        user = self.request.user
        if not hasattr(user, 'studentprofile'):
             raise serializers.ValidationError({"detail": "Student profile not found."})
        
        # Check for duplicate is handled by model unique_together, but we can double check or let DRF handle it
        # The serializer should default 'date' to today if not provided, or frontend provides it.
        # Assuming frontend sends date and meal_type.
        
        serializer.save(student=user.studentprofile)

    @decorators.action(detail=False, methods=['post'], permission_classes=[IsStaffOrReadOnly])
    def bulk_update(self, request):
        """
        Expects payload:
        {
            "date": "YYYY-MM-DD",
            "records": [
                { "reg_num": "123", "is_present": true, "meal_type": "Veg" },
                ...
            ]
        }
        """
        date = request.data.get('date')
        records = request.data.get('records')

        if not date or not records:
             return Response({'error': 'Date and records are required'}, status=status.HTTP_400_BAD_REQUEST)

        updated_count = 0
        errors = []

        for record in records:
            reg_num = record.get('reg_num')
            # Default to Present=True if not specified, though usually admin specifies
            is_present = record.get('is_present', True)
            meal_type = record.get('meal_type', 'Veg')

            try:
                student = StudentProfile.objects.get(reg_num=reg_num)
                # Create or update the attendance record for this student/date
                Attendance.objects.update_or_create(
                    student=student,
                    date=date,
                    defaults={
                        'is_present': is_present,
                        'meal_type': meal_type
                    }
                )
                updated_count += 1
            except StudentProfile.DoesNotExist:
                errors.append(f"Student with reg_num {reg_num} not found")
            except Exception as e:
                errors.append(f"Error for {reg_num}: {str(e)}")

        return Response({
            'message': f'Successfully processing attendance. Updated/Created {updated_count} records.',
            'errors': errors
        })

class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
         user = self.request.user
         if user.is_staff_member:
             return Bill.objects.all()
         if hasattr(user, 'studentprofile'):
             return Bill.objects.filter(student=user.studentprofile)
         return Bill.objects.none()

    @decorators.action(detail=False, methods=['post'], permission_classes=[IsStaffOrReadOnly])
    def generate_bills(self, request):
        month_str = request.data.get('month') # Expected format YYYY-MM
        
        # New Inputs
        daily_rate_input = request.data.get('daily_rate')
        nv_plate_rate_input = request.data.get('nv_plate_rate')
        
        # Detailed Fixed Charges
        room_rent_input = request.data.get('room_rent', 150)
        water_charges_input = request.data.get('water_charges', 125)
        electricity_charges_input = request.data.get('electricity_charges', 150)
        establishment_charges_input = request.data.get('establishment_charges', 275)
        
        if not month_str or not daily_rate_input or not nv_plate_rate_input:
            return Response({'error': 'Month, Daily Rate, and NV Plate Rate are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            year, month = map(int, month_str.split('-'))
            daily_rate = float(daily_rate_input)
            nv_rate = float(nv_plate_rate_input)
            
            room_rent = float(room_rent_input)
            water = float(water_charges_input)
            curr_elec = float(electricity_charges_input)
            est = float(establishment_charges_input)
            
        except ValueError:
             return Response({'error': 'Invalid format. Month: YYYY-MM, Rates: Numbers'}, status=status.HTTP_400_BAD_REQUEST)

        students = StudentProfile.objects.all()
        created_count = 0
        
        fixed_total = room_rent + water + curr_elec + est

        for student in students:
            # Calculate Total Present Days (Veg + Non-Veg)
            present_days = Attendance.objects.filter(
                student=student, 
                date__year=year, 
                date__month=month,
                is_present=True
            ).count()

            # Calculate days where meal_type was Non-Veg
            nv_days = Attendance.objects.filter(
                student=student, 
                date__year=year, 
                date__month=month,
                is_present=True,
                meal_type='Non-Veg'
            ).count()
            
            # Formula: (Present Days * Daily Rate) + (NV Days * NV Extra Rate) + Fixed Charges
            # Note: "Daily Rate" covers the base cost of a meal (Veg). 
            # If they ate Non-Veg, they pay Daily Rate + NV Extra Rate.
            
            food_cost = present_days * daily_rate
            nv_add_on_cost = nv_days * nv_rate
            
            total_amount = food_cost + nv_add_on_cost + fixed_total
            
            # Check if bill already exists for this month
            bill, created = Bill.objects.update_or_create(
                student=student, 
                month=month_str, 
                defaults={
                    'amount': total_amount,
                    'daily_rate': daily_rate,
                    'nv_plate_rate': nv_rate,
                    'room_rent': room_rent,
                    'water_charges': water,
                    'electricity_charges': curr_elec,
                    'establishment_charges': est
                }
            )
            
            if created:
                created_count += 1
        
        return Response({
            'message': f'Bills generated for {len(students)} students using new logic.', 
            'created': created_count,
            'updated': len(students) - created_count
        })
