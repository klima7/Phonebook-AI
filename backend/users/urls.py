from django.urls import path
from rest_framework.authtoken import views
from .views import CurrentUserView

urlpatterns = [
    path('token/', views.obtain_auth_token, name='create-token'),
    path('me/', CurrentUserView.as_view(), name='current-user')
]
