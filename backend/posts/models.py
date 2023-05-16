from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Post(models.Model):
    description = models.TextField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering=['-created_at']
        
    def __str__(self):
        return f"{self.created_by}'s Post"
    
class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="post_images")
    
    def __str__(self):
        return f"{self.post}'s Image"
    
class LikePost(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user} like {self.post}"
    
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent_comment = models.ForeignKey("self", null=True, blank=True,  on_delete=models.CASCADE , related_name='replies')
    
    class Meta:
        ordering=['-created_at']
        
    def __str__(self):
        return f"{self.user} comment on {self.post}"
    
    @property
    def children(self):
        return Comment.objects.filter(parent_comment=self).reverse()
    
    @property
    def is_parent(self):
        if self.parent_comment is None:
            return True
        return False