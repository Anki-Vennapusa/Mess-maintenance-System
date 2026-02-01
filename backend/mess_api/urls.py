from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, StudentProfileViewSet, MenuViewSet, AttendanceViewSet, BillViewSet, MeView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'profiles', StudentProfileViewSet)
router.register(r'menu', MenuViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'bills', BillViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
