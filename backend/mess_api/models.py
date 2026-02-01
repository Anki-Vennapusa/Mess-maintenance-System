from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_staff_member = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    reg_num = models.CharField(max_length=20, unique=True)
    branch = models.CharField(max_length=50)
    year = models.IntegerField()
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.reg_num}"

class Menu(models.Model):
    DAYS = (
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    )
    day = models.CharField(max_length=15, choices=DAYS, unique=True)
    breakfast = models.TextField()
    lunch = models.TextField()
    dinner = models.TextField()

    def __str__(self):
        return self.day

class Attendance(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    date = models.DateField()
    is_present = models.BooleanField(default=True)
    MEAL_TYPES = (
        ('Veg', 'Veg'),
        ('Non-Veg', 'Non-Veg'),
    )
    meal_type = models.CharField(max_length=10, choices=MEAL_TYPES, default='Veg')

    class Meta:
        unique_together = ('student', 'date')

    def __str__(self):
        return f"{self.student.reg_num} - {self.date}"

class Bill(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    month = models.CharField(max_length=20) # e.g., "January 2025" or a date field
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    generated_date = models.DateField(auto_now_add=True)
    
    # Snapshot of rates used for calculation
    # Snapshot of rates used for calculation
    daily_rate = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    nv_plate_rate = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    
    # Detailed Fixed Charges
    room_rent = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    water_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    electricity_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    establishment_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.student.reg_num} - {self.month} - {self.amount}"
