from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DigimonViewSet

router = DefaultRouter()
router.register(r'', DigimonViewSet, basename='digimon')

urlpatterns = [
    path('', include(router.urls)),
]