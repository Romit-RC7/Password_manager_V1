from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from cryptography.fernet import InvalidToken

from .models import VaultItem
from .serializers import VaultItemSerializer

from accounts.utils import encrypt_password, decrypt_password

import logging

logger = logging.getLogger(__name__)


# =========================
# 🔐 ADD VAULT ITEM
# =========================
class AddVaultItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            master_password = request.data.get("master_password")
            password = request.data.get("password")
            website = request.data.get("website")
            username = request.data.get("username")

            # 🔴 VALIDATION
            if not all([master_password, password, website, username]):
                return Response(
                    {"error": "All fields are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 🔐 ENCRYPT
            try:
                encrypted = encrypt_password(master_password, password)
            except Exception as e:
                logger.error(f"Encryption error: {str(e)}")
                return Response(
                    {"error": "Encryption failed"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            data = request.data.copy()
            data["password"] = encrypted

            serializer = VaultItemSerializer(data=data)

            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.exception("Unexpected error in AddVaultItemView")
            return Response(
                {"error": "Something went wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =========================
# 🔓 GET VAULT ITEMS
# =========================
class GetVaultItemsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            master_password = request.data.get("master_password")

            if not master_password:
                return Response(
                    {"error": "Master password required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            items = VaultItem.objects.filter(user=request.user)
            result = []

            for item in items:
                try:
                    decrypted = decrypt_password(master_password, item.password)
                except InvalidToken:
                    return Response(
                        {"error": "Wrong master password"},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                except Exception as e:
                    logger.error(f"Decryption error: {str(e)}")
                    return Response(
                        {"error": "Decryption failed"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

                result.append({
                    "id": item.id,
                    "website": item.website,
                    "username": item.username,
                    "password": decrypted,
                    "category": item.category,
                    "notes": item.notes
                })

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception("Unexpected error in GetVaultItemsView")
            return Response(
                {"error": "Something went wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =========================
# ✏️ UPDATE VAULT ITEM
# =========================
class UpdateVaultItemView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            item = get_object_or_404(VaultItem, id=pk, user=request.user)

            master_password = request.data.get("master_password")
            password = request.data.get("password")

            if not master_password or not password:
                return Response(
                    {"error": "Master password and password required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                encrypted = encrypt_password(master_password, password)
            except Exception as e:
                logger.error(f"Encryption error: {str(e)}")
                return Response(
                    {"error": "Encryption failed"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # ✅ UPDATE FIELDS SAFELY
            item.website = request.data.get("website", item.website)
            item.username = request.data.get("username", item.username)
            item.password = encrypted
            item.category = request.data.get("category", item.category)
            item.notes = request.data.get("notes", item.notes)

            item.save()

            return Response(
                {"msg": "Updated successfully"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.exception("Unexpected error in UpdateVaultItemView")
            return Response(
                {"error": "Something went wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =========================
# 🗑️ DELETE VAULT ITEM
# =========================
class DeleteVaultItemView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            item = get_object_or_404(VaultItem, id=pk, user=request.user)
            item.delete()

            return Response(
                {"msg": "Deleted successfully"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.exception("Unexpected error in DeleteVaultItemView")
            return Response(
                {"error": "Something went wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )