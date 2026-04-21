from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Digimon
from .serializers import DigimonSerializer


class DigimonViewSet(viewsets.ModelViewSet):
    serializer_class = DigimonSerializer
    # permission_classes satırını geçici olarak yorum satırına al veya AllowAny yap
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Bu print satırı terminalde kimin geldiğini görmemizi sağlar
        print(f"İsteği atan kullanıcı: {self.request.user}")

        if self.request.user.is_authenticated:
            return Digimon.objects.filter(owner=self.request.user)

        # Eğer hala boş dönüyorsa, test için tümünü döndürelim:
        return Digimon.objects.all()

    def get_permissions(self):
        # Listeleme (GET) herkese açık olsun derseniz:
        if self.action == 'list':
            return [AllowAny()]
        # Silme, güncelleme gibi işlemler için giriş şart olsun:
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        # Kayıt oluşturulurken isteği atan kullanıcıyı sahip olarak ekler
        serializer.save(owner=self.request.user)
