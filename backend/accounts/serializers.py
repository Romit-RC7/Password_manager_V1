from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        if not validated_data.get("password"):
            raise serializers.ValidationError("Password required")

        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
    
# def create(self, validated_data):
#     return User.objects.create_user(**validated_data)

# # Uses create_user() instead of create() to ensure password is hashed using set_password()
# # validated_data is unpacked into arguments (email=..., password=...)
# # If we used User.objects.create(), password would be stored in plain text (INSECURE)    

from django.contrib.auth.hashers import make_password
# Serializer for updating master password, uses make_password to hash the password before saving to database
class MasterPasswordSerializer(serializers.Serializer):
    master_password = serializers.CharField(write_only=True)

    def update(self, instance, validated_data):
        instance.master_password = make_password(validated_data['master_password'])
        instance.save()
        return instance