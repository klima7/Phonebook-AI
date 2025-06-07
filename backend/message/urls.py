from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MessageList, ConversationViewSet

router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')

urlpatterns = [
    path('', MessageList.as_view(), name='message-list'),
    path('', include(router.urls)),
] 