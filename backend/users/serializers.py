from django.contrib.auth.models import User
from .models import Profile, Follow
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    class Meta:
        model = User
        fields = ("username", "email", "password")
        extra_kwargs = {'password': {'write_only': True}}
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")
        
class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    class Meta:
        model = Profile
        fields = "__all__"

class UpdateAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("avatar_img", )
        
class EditProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("bio", "location")
        
class FollowSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    follower = serializers.CharField()
    class Meta:
        model = Follow
        fields = "__all__"