from rest_framework import serializers
from .models import Post, PostImage, LikePost, Comment

class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = "__all__"
        
class PostSerializer(serializers.ModelSerializer):
    images =  PostImageSerializer(many=True, read_only=True)
    created_by = serializers.CharField()
    
    class Meta:
        model = Post
        fields = ["id", "description", "created_at", "created_by", "images"]
        
class LikePostSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    class Meta:
        model = LikePost
        fields = "__all__"
        
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    class Meta:
        model = Comment
        fields = "__all__"