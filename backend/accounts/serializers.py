from rest_framework import serializers
from django.contrib.auth.hashers import make_password

from .models import User


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['email', 'password']

        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_email(self, value):

        if User.objects.filter(email=value).exists():

            raise serializers.ValidationError(
                "User already registered with this email"
            )

        return value

    def validate_password(self, value):

        if not value:
            raise serializers.ValidationError(
                "Password required"
            )

        if len(value) < 6:
            raise serializers.ValidationError(
                "Password must be at least 6 characters"
            )

        return value

    def create(self, validated_data):

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user


class MasterPasswordSerializer(serializers.Serializer):

    master_password = serializers.CharField(write_only=True)

    def update(self, instance, validated_data):

        instance.master_password = make_password(
            validated_data['master_password']
        )

        instance.save()

        return instance