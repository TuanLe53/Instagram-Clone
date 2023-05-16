from django.urls import path
from . import views

urlpatterns = [
    path("upload/", views.UploadPost, name="upload_post"),
    path("posts/", views.Posts, name="posts"),
    path("posts/<str:user_profile>/", views.ProfilePosts, name="profile_posts"),
    path("post/<int:post_id>/like/<int:user_id>/", views.LikePostAPI, name="like_post"),
    path("post/comment/<int:post_id>/", views.CommentAPI, name="comment"),
    path("post/like-count/<int:post_id>/", views.PostLikesCountAPI, name="like-count"),
]
