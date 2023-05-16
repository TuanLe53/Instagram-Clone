from django.urls import path, re_path
from .views import MyTokenObtainPairView, Register, UserProfile, FollowApi, UpdateAvatar, EditProfile, FollowerCountApi, FollowingCountApi, SuggestedUser, SearchUser

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/',  MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("register/", Register, name="register_user"),
    path("suggested-user/<str:user>/", SuggestedUser, name="suggested_user"),
    path("search/", SearchUser, name="search_user"),
    path("profile/<str:userprofile>/", UserProfile, name="profile"),
    path("profile/<str:userprofile>/follower/", FollowerCountApi, name="follower"),
    path("profile/<str:userprofile>/following/", FollowingCountApi, name="following"),
    path("profile/<str:userprofile>/update-avatar/", UpdateAvatar, name="update_avatar"),
    path("profile/<str:userprofile>/edit-profile/", EditProfile, name="edit-profile"),
    path("profile/<str:userprofile>/follow/<int:username>/", FollowApi, name="follow"),
]