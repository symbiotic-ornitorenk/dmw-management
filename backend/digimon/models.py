from django.db import models
from django.contrib.auth.models import User

class Digimon(models.Model):
    # İlişki
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='digimons')
    # 1. Temel Bilgiler (Base Info)
    name = models.CharField(max_length=100, help_text="Digimon Name")

    # Tür ve Element (Enum benzeri seçimler daha sağlıklı olur)
    TYPE_CHOICES = [
        ('Data', 'Data'),
        ('Vaccine', 'Vaccine'),
        ('Virus', 'Virus'),
        ('Unknown', 'Unknown'),
        ('None', 'None'),
    ]
    digi_type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    ELEMENT_CHOICES = [
        ('Fire', 'Fire'), ('Light', 'Light'), ('Steel', 'Steel'),('Wind', 'Wind'),
        ('Ice', 'Ice'), ('Neutral', 'Neutral'), ('Thunder', 'Thunder'),('Wood', 'Wood'),
        ('Land', 'Land'), ('Dark', 'Dark'), ('Water', 'Water'),
    ]
    element = models.CharField(max_length=20, choices=ELEMENT_CHOICES)

    # Evrim Aşaması
    STAGE_CHOICES = [
        ('Rookie', 'Rookie'), ('Rookie X', 'Rookie X'),
        ('Champion', 'Champion'), ('Champion X', 'Champion X'),
        ('Ultimate', 'Ultimate'), ('Ultimate X', 'Ultimate X'),
        ('Mega', 'Mega'), ('Mega X', 'Mega X'),
        ('Burst Mode', 'Burst Mode'), ('Burst Mode X', 'Burst Mode X'),
        ('Jogress', 'Jogress'), ('Jogress X', 'Jogress X'),
        ('Hybrid', 'Hybrid'), ('Variant', 'Variant'), ('Armor', 'Armor'),
    ]
    stage = models.CharField(max_length=30, choices=STAGE_CHOICES)

    # Boyut ve Hatch Detayları
    size = models.FloatField(default=140.0, help_text="Boyut yüzdesi (%)")
    hatch_level = models.IntegerField(
        choices=[(3, '3/5'), (4, '4/5'), (5, '5/5'), (6, '6/5'), (7, '7/5'), ],
        default=5,
        help_text="Hatch aşaması (3/5, 4/5, 5/5)"
    )

    # Görsel
    image = models.ImageField(upload_to='digimons/images/', null=True, blank=True)

    def __str__(self):
        return f"{self.name}"


class DigimonEvolution(models.Model):
    # Hangi Digimon'dan? (Örn: MetalGreymon Black veya Megadramon)
    from_digimon = models.ForeignKey(
        'Digimon',
        on_delete=models.CASCADE,
        related_name='previous_evolutions'
    )
    # Hangi Digimon'a? (Örn: Mugendramon)
    to_digimon = models.ForeignKey(
        'Digimon',
        on_delete=models.CASCADE,
        related_name='next_evolutions'
    )

    class Meta:
        # Aynı evrimden iki tane olmasın
        unique_together = ('from_digimon', 'to_digimon')

    def __str__(self):
        return f"{self.from_digimon.name} -> {self.to_digimon.name}"


class DigimonStats(models.Model):
    digimon = models.OneToOneField(
        'Digimon',
        on_delete=models.CASCADE,
        related_name='stats'
    )

    # Görseldeki Statlar
    hp = models.IntegerField(default=0, help_text="Health Points")
    ds = models.IntegerField(default=0, help_text="Digisoul")
    at = models.IntegerField(default=0, help_text="Attack")
    as_speed = models.FloatField(default=0.0, help_text="Attack Speed")  # 'as' rezerve kelime olabilir
    ct = models.FloatField(default=0.0, help_text="Critical Hit (%)")
    cd = models.FloatField(default=0.0, help_text="Critical Damage (%)")
    ht = models.IntegerField(default=0, help_text="Hit Rate")
    de = models.IntegerField(default=0, help_text="Defense")
    bl = models.FloatField(default=0.0, help_text="Block (%)")
    ev = models.FloatField(default=0.0, help_text="Evasion (%)")
    sk = models.FloatField(default=0.0, help_text="Skill Damage (%)")

    def __str__(self):
        return f"Stats for {self.digimon.name}"