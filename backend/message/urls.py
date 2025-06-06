from django.urls import path
from .views import MessageList

urlpatterns = [
    path('', MessageList.as_view(), name='message-list'),
] 