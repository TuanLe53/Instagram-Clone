from rest_framework import  status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .models import Profile, Follow
from django.db.models import Q
from .serializers import RegisterSerializer, ProfileSerializer, FollowSerializer, UpdateAvatarSerializer, EditProfileSerializer, UserSerializer
import random
from rest_framework.generics import ListAPIView
from rest_framework.pagination import LimitOffsetPagination
# Create your views here.

from rest_framework.views import APIView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        # ...
        
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
#API
@api_view(["POST"])
def Register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.create_user(
            serializer.data['username'],
            serializer.data['email'],
            serializer.initial_data['password'],
        )
        Profile.objects.create(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def UserProfile(request, userprofile):

    try:
        user = User.objects.get(username=userprofile)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    profile = Profile.objects.get(user=user)
    
    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)   
    
    return Response(status=status.HTTP_400_BAD_REQUEST)   
  
@api_view(["PUT"])  
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def UpdateAvatar(request, userprofile):
    try:
        user = User.objects.get(username=userprofile)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    profile = Profile.objects.get(user=user)
    
    if request.method == "PUT":
        
        serializer = UpdateAvatarSerializer(profile, data= request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def EditProfile(request, userprofile):
    try:
        user = User.objects.get(username=userprofile)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    profile = Profile.objects.get(user=user)
    
    if request.method == "PATCH":
        serializer = EditProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def FollowApi(request, userprofile, username):
    try:
        user_profile = User.objects.get(username=userprofile)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    if request.method == "GET":
        try:
            fl_obj = Follow.objects.get(user=user_profile, follower=username)
            return Response(status=status.HTTP_200_OK)
        except Follow.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    elif request.method == "POST":
        follow = Follow.objects.create(user=user_profile, follower=User.objects.get(id=username))
        serializer = FollowSerializer(follow)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == "DELETE":
        fl_obj = Follow.objects.get(user=user_profile, follower=username)
        fl_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
   
@api_view(["GET"]) 
@permission_classes([IsAuthenticated])
def FollowerCountApi(request, userprofile):
    try:
        user_profile = User.objects.get(username=userprofile)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == "GET":
        try:
            follower = Follow.objects.filter(user=user_profile)
            serializer = FollowSerializer(follower, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Follow.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"]) 
@permission_classes([IsAuthenticated])
def FollowingCountApi(request, userprofile):
    try:
        user_profile = User.objects.get(username=userprofile)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == "GET":
        try:
            following = Follow.objects.filter(follower=user_profile)
            serializer = FollowSerializer(following, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Follow.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
@api_view(["GET"])
def SuggestedUser(request, user):
    req_user = User.objects.get(username=user)
    pks = [ i for i in Profile.objects.values_list("pk", flat=True) if i != req_user.id]
    random_pks = random.choices(pks, k=3)
    profile_list = [Profile.objects.get(id=pk) for pk in random_pks]
    serializer = ProfileSerializer(profile_list, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def SearchUser(request):
    username = request.query_params.get("username")
    
    if username is not None:
        profile_list = Profile.objects.filter(Q(user__username__icontains=username))
        serializer = ProfileSerializer(profile_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_404_NOT_FOUND)