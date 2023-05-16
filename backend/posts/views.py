from rest_framework import  status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import PostSerializer, LikePostSerializer, CommentSerializer
from .models import Post, PostImage, LikePost, Comment

# Create your views here.
@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def UploadPost(request):

    serializer = PostSerializer(data=request.data)
    
    if serializer.is_valid():
        post = Post.objects.create(description=request.data["description"], created_by=User.objects.get(id=request.data["created_by"]))
        
        for file in request.FILES.getlist("images"):
            PostImage.objects.create(post=post, image=file)
            
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def Posts(request):
    
    if request.method == "GET":
        posts = Post.objects.all().order_by("-created_at")
        serializer = PostSerializer(posts, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
def ProfilePosts(request, user_profile):
    
    if request.method == "GET":
        user = User.objects.get(username=user_profile)
        posts = Post.objects.filter(created_by=user).order_by("-created_at")
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(["GET"])
def PostLikesCountAPI(request, post_id):
    if request.method == "GET":
        likes = LikePost.objects.filter(post=Post.objects.get(id=post_id))
        serializer = LikePostSerializer(likes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def LikePostAPI(request, post_id, user_id):
    
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    if request.method == "GET":
        try:
            like_obj = LikePost.objects.get(post=post, user=user_id)
            return Response(status=status.HTTP_200_OK)
        except LikePost.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    elif request.method == "POST":
        like = LikePost.objects.create(post=post, user=User.objects.get(id=user_id))
        serializer = LikePostSerializer(like)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == "DELETE":
        like_obj = LikePost.objects.get(post=post, user=user_id)
        like_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def CommentAPI(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == "GET":
        comment_obj = Comment.objects.filter(post=post).order_by("-created_at")
        serializer = CommentSerializer(comment_obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        serializer = CommentSerializer(data=request.data)
        user = User.objects.get(id=request.data["user"])
        if serializer.is_valid():
            try:
                parent_comment = request.data["parent_comment"]
                parent_comment = Comment.objects.get(id=parent_comment)
            except:
                parent_comment = None
            serializer.save(parent_comment=parent_comment, user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)