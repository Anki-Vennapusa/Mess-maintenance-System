from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("<h1>SVU Hostel Mess Backend is Running!</h1><p>Go to <a href='/admin/'>/admin/</a> or use the frontend.</p>")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('mess_api.urls')),
    path('', home),
]
