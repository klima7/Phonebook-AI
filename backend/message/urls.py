from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MessageViewSet, ConversationViewSet

router = DefaultRouter()
router.register(r'', ConversationViewSet, basename='conversation')
router.register("(?P<conversation_id>[^/.]+)/messages", MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
] 