from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import RegisterSerializer, MasterPasswordSerializer

import logging

logger = logging.getLogger(__name__)


# =========================
# 🔹 REGISTER
# =========================
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"msg": "User created successfully"},
                    status=status.HTTP_201_CREATED
                )

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            logger.exception("Error in RegisterView")
            return Response(
                {"error": "Something went wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =========================
# 🔹 LOGIN (JWT)
# =========================
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")

            if not email or not password:
                return Response(
                    {"error": "Email and password required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = authenticate(request, email=email, password=password)

            if user is None:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception("Error in LoginView")
            return Response(
                {"error": "Something went wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =========================
# 🔹 SET MASTER PASSWORD
# =========================
class SetMasterPasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = MasterPasswordSerializer(data=request.data)

            if serializer.is_valid():
                serializer.update(request.user, serializer.validated_data)
                return Response(
                    {"msg": "Master password set successfully"},
                    status=status.HTTP_200_OK
                )

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            logger.exception("Error in SetMasterPasswordView")
            return Response(
                {"error": "Something went wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =========================
# 🔹 VERIFY MASTER PASSWORD
# =========================
class VerifyMasterPasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            master_password = request.data.get("master_password")

            if not master_password:
                return Response(
                    {"error": "Master password required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not request.user.master_password:
                return Response(
                    {"error": "Master password not set"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if check_password(master_password, request.user.master_password):
                return Response(
                    {"msg": "Vault unlocked"},
                    status=status.HTTP_200_OK
                )

            return Response(
                {"error": "Wrong master password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        except Exception as e:
            logger.exception("Error in VerifyMasterPasswordView")
            return Response(
                {"error": "Something went wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =========================
# 🔹 CHECK MASTER PASSWORD
# =========================
class CheckMasterPasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            return Response(
                {"exists": bool(request.user.master_password)},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.exception("Error in CheckMasterPasswordView")
            return Response(
                {"error": "Something went wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )