from django.contrib import admin
from .models import Digimon, DigimonEvolution, DigimonStats


# Statları Digimon sayfasının içinde görebilmek için (Opsiyonel ama kullanışlı)
class DigimonStatsInline(admin.StackedInline):
    model = DigimonStats
    can_delete = False


@admin.register(Digimon)
class DigimonAdmin(admin.ModelAdmin):
    # Admin listesinde görünecek sütunlar
    list_display = ('name', 'stage', 'digi_type', 'element', 'owner')
    # Filtreleme seçenekleri
    list_filter = ('stage', 'digi_type', 'element')
    # Arama kutusu
    search_fields = ('name', 'owner__username')
    inlines = [DigimonStatsInline]


@admin.register(DigimonEvolution)
class DigimonEvolutionAdmin(admin.ModelAdmin):
    list_display = ('from_digimon', 'to_digimon')
    search_fields = ('from_digimon__name', 'to_digimon__name')


@admin.register(DigimonStats)
class DigimonStatsAdmin(admin.ModelAdmin):
    list_display = ('digimon', 'hp', 'ds', 'at')
from django.contrib import admin

# Register your models here.
