from rest_framework import serializers
from .models import User, StudentProfile, Menu, Attendance, Bill

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'is_student', 'is_staff_member')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)


    class Meta:
        model = StudentProfile
        fields = '__all__'

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

class BillSerializer(serializers.ModelSerializer):
    student_reg_num = serializers.CharField(source='student.reg_num', read_only=True)
    student_name = serializers.CharField(source='student.user.username', read_only=True)
    
    # Explicitly including fields is safer, but __all__ should work.
    # To be safe and ensure ordering or documentation, I leave it as __all__.
    # However, since I just modified the model, the serializer needs to pick it up.
    # Restarting the server might be needed if it caches, but normally dev server reloads.
    
    class Meta:
        model = Bill
        fields = '__all__'
