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
    owner_username = serializers.ReadOnlyField(source='owner.username')
    stats = DigimonStatsSerializer(read_only=True)

    # related_name'leri kullanarak evrim serializer'ını bağlıyoruz
    evolves_from = DigimonEvolutionSerializer(source='previous_evolutions', many=True, read_only=True)
    evolves_to = DigimonEvolutionSerializer(source='next_evolutions', many=True, read_only=True)

    class Meta:
        model = Digimon
        fields = [
            'id', 'owner', 'owner_username', 'name', 'digi_type',
            'element', 'stage', 'size', 'hatch_level', 'image',
            'stats', 'evolves_from', 'evolves_to'
        ]
        read_only_fields = ['owner']