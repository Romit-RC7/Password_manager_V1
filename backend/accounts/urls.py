from django.urls import path
from .views import CheckMasterPasswordView, LoginView, RegisterView, VerifyMasterPasswordView, SetMasterPasswordView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('set-master-password/', SetMasterPasswordView.as_view()),
    path('verify-master-password/', VerifyMasterPasswordView.as_view()),
    path('check-master-password/', CheckMasterPasswordView.as_view()),
]