// Backend Modellerine Sadık Sabit Veriler
export const STAGES = ['Rookie', 'Rookie X', 'Champion', 'Champion X', 'Ultimate', 'Ultimate X', 'Mega', 'Mega X', 'Burst Mode', 'Burst Mode X', 'Jogress', 'Jogress X', 'Hybrid', 'Variant', 'Armor'];
export const TYPES = ['Data', 'Vaccine', 'Virus', 'Unknown', 'None'];
export const ELEMENTS = ['Fire', 'Light', 'Steel', 'Wind', 'Ice', 'Neutral', 'Thunder', 'Wood', 'Land', 'Dark', 'Water'];

export const STAT_FIELDS = [
    {id: 'hp', label: 'HP'}, {id: 'ds', label: 'DS'}, {id: 'at', label: 'AT'},
    {id: 'as_speed', label: 'AS', step: '0.01'}, {id: 'ct', label: 'CT %', step: '0.1'},
    {id: 'cd', label: 'CD %', step: '0.1'}, {id: 'ht', label: 'HT'},
    {id: 'de', label: 'DE'}, {id: 'bl', label: 'BL %', step: '0.1'},
    {id: 'ev', label: 'EV %', step: '0.1'}, {id: 'sk', label: 'SK %', step: '0.1'},
];

export const ORB_COLORS = {
    /* TYPES */
    'Data': 'from-[#5fbdff] to-[#004a80]',
    'Vaccine': 'from-[#5fff5f] to-[#008000]',
    'Virus': 'from-[#ff5f5f] to-[#800000]',
    'Unknown': 'from-[#ff5fff] to-[#800080]',
    'None': 'from-[#a0a0a0] to-[#404040]',
    /* ELEMENT ORBS */
    'Fire': 'from-[#ffcc33] to-[#ff0000]',
    'Light': 'from-[#ffffeb] to-[#ffcc33]',
    'Steel': 'from-[#e0e0e0] to-[#707070]',
    'Wind': 'from-[#99ffcc] to-[#00994d]',
    'Ice': 'from-[#adebff] to-[#3366ff]',
    'Neutral': 'from-[#f0f0f0] to-[#999999]',
    'Thunder': 'from-[#ffff99] to-[#ffcc00]',
    'Wood': 'from-[#b3ff66] to-[#4d9900]',
    'Land': 'from-[#cc9966] to-[#663300]',
    'Dark': 'from-[#9966ff] to-[#330066]',
    'Water': 'from-[#33ccff] to-[#0000ff]',
};