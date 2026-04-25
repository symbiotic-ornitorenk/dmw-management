import json

from rest_framework import serializers
from .models import Digimon, DigimonStats, DigimonEvolution


# 1. Statlar için bağımsız yapı
class DigimonStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DigimonStats
        fields = '__all__'


# 2. Evrimler için bağımsız yapı (İleride buraya 'req_item' vb. ekleyebilirsin)
class DigimonEvolutionSerializer(serializers.ModelSerializer):
    from_digimon_name = serializers.ReadOnlyField(source='from_digimon.name')
    to_digimon_name = serializers.ReadOnlyField(source='to_digimon.name')

    class Meta:
        model = DigimonEvolution
        fields = ['from_digimon_name', 'to_digimon_name']


# 3. Ana Digimon Serializer
class DigimonSerializer(serializers.ModelSerializer):
    # required=False yaparak boş bırakıldığında hata vermesini engelliyoruz
    stats = DigimonStatsSerializer(required=False)
    owner_username = serializers.ReadOnlyField(source='owner.username')

    # 1. Alan Tanımlamaları
    evolves_from_name = serializers.SerializerMethodField()
    evolves_to_name = serializers.SerializerMethodField()
    evolves_from_id = serializers.SerializerMethodField()
    evolves_to_id = serializers.SerializerMethodField()

    class Meta:
        model = Digimon
        fields = '__all__'
        read_only_fields = ['owner']

    def get_evolves_from_name(self, obj):
        evo = DigimonEvolution.objects.filter(to_digimon=obj).first()
        return evo.from_digimon.name if evo else None

    def get_evolves_to_name(self, obj):
        evo = DigimonEvolution.objects.filter(from_digimon=obj).first()
        return evo.to_digimon.name if evo else None

    def get_evolves_from_id(self, obj):
        evo = DigimonEvolution.objects.filter(to_digimon=obj).first()
        return evo.from_digimon.id if evo else ""

    def get_evolves_to_id(self, obj):
        evo = DigimonEvolution.objects.filter(from_digimon=obj).first()
        return evo.to_digimon.id if evo else ""

    def create(self, validated_data):
        # 1. Stats verisini initial_data'dan (gelen ham veri) çekiyoruz
        stats_raw = self.initial_data.get('stats')

        # 2. Eğer veri string olarak geldiyse JSON objesine çeviriyoruz
        if isinstance(stats_raw, str):
            try:
                stats_data = json.loads(stats_raw)
            except json.JSONDecodeError:
                stats_data = {}
        else:
            stats_data = stats_raw or {}

        # 3. Evrim ID'lerini alıyoruz
        from_id = self.initial_data.get('evolves_from_id')
        to_id = self.initial_data.get('evolves_to_id')

        # 4. Digimon'u oluşturuyoruz
        # (validated_data içinde stats artık olmayabilir veya hatalı olabilir, o yüzden pop kullanmaya gerek kalmadı)
        # Sadece modeldeki alanları gönderdiğimizden emin oluyoruz
        digimon = Digimon.objects.create(**validated_data)

        # 5. İstatistikleri oluşturuyoruz (Eksik alanlar modeldeki default 0 değerini alır)
        DigimonStats.objects.create(digimon=digimon, **stats_data)

        # 6. Evrim bağlarını kuruyoruz
        if from_id:
            DigimonEvolution.objects.create(from_digimon_id=from_id, to_digimon=digimon)
        if to_id:
            DigimonEvolution.objects.create(from_digimon=digimon, to_digimon_id=to_id)

        return digimon

    def update(self, instance, validated_data):
        # 1. Ana Digimon Bilgilerini Güncelle
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 2. Stats Güncelleme
        stats_raw = self.initial_data.get('stats')
        if stats_raw:
            if isinstance(stats_raw, str):
                stats_data = json.loads(stats_raw)
            else:
                stats_data = stats_raw

            # KRİTİK DÜZELTME: stats içindeki digimon ID'sini veya id alanını siliyoruz
            # Çünkü setattr bunları doğrudan modele yazmaya çalışınca ValueError verir.
            stats_data.pop('digimon', None)
            stats_data.pop('id', None)

            stats_obj, created = DigimonStats.objects.get_or_create(digimon=instance)
            for attr, value in stats_data.items():
                setattr(stats_obj, attr, value)
            stats_obj.save()

        # 3. Evrimleri Güncelleme
        from_id = self.initial_data.get('evolves_from_id')
        to_id = self.initial_data.get('evolves_to_id')

        if from_id is not None:
            DigimonEvolution.objects.filter(to_digimon=instance).delete()
            if from_id != "" and from_id != "None":
                DigimonEvolution.objects.create(from_digimon_id=from_id, to_digimon=instance)

        if to_id is not None:
            DigimonEvolution.objects.filter(from_digimon=instance).delete()
            if to_id != "" and to_id != "None":
                DigimonEvolution.objects.create(from_digimon=instance, to_digimon_id=to_id)

        return instance
