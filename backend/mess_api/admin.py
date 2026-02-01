from django.contrib import admin
from .models import User, StudentProfile, Menu, Attendance, Bill

admin.site.register(User)
@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('day', 'get_breakfast', 'get_lunch', 'get_dinner')
    ordering = ('id',) # Basic ordering

    def get_breakfast(self, obj):
        return obj.breakfast[:50] + '...' if len(obj.breakfast) > 50 else obj.breakfast
    get_breakfast.short_description = 'Breakfast'

    def get_lunch(self, obj):
        return obj.lunch[:50] + '...' if len(obj.lunch) > 50 else obj.lunch
    get_lunch.short_description = 'Lunch'

    def get_dinner(self, obj):
        return obj.dinner[:50] + '...' if len(obj.dinner) > 50 else obj.dinner
    get_dinner.short_description = 'Dinner'

class AttendanceInline(admin.TabularInline):
    model = Attendance
    extra = 1

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'reg_num', 'branch', 'year')
    search_fields = ('user__username', 'reg_num')
    list_filter = ('branch', 'year')
    inlines = [AttendanceInline]

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'date', 'is_present', 'meal_type')
    list_filter = ('date', 'meal_type', 'is_present')
    search_fields = ('student__reg_num', 'student__user__username')
    list_editable = ('is_present', 'meal_type')
    date_hierarchy = 'date'

@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('student', 'month', 'amount', 'is_paid', 'generated_date')
    list_filter = ('is_paid', 'month', 'generated_date')
    search_fields = ('student__reg_num', 'student__user__username', 'month')
    list_editable = ('is_paid',)
    actions = ['mark_as_paid']

    def mark_as_paid(self, request, queryset):
        updated = queryset.update(is_paid=True)
        self.message_user(request, f'{updated} bills marked as paid.')
    mark_as_paid.short_description = "Mark selected bills as Paid"
