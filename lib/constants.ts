export const WHITSTABLE_CENTER = {
  lat: 51.3607,
  lng: 1.0253,
};

export const CATEGORY_ICONS: Record<string, string> = {
  'oysters-seafood': '🦪',
  'cafe-coffee': '☕',
  'restaurant-pub': '🍽️',
  'fish-chips-takeaway': '🐟',
  'gallery-art': '🎨',
  'boutique-fashion': '👗',
  'homeware-interiors': '🏠',
  'books-records': '📚',
  'deli-food': '🧀',
  'gifts-souvenirs': '🎁',
  'antiques-vintage': '🪞',
  'harbour-stalls': '⚓',
  'services': '🔧',
  'accommodation': '🛏️',
};

export const CATEGORY_COLORS: Record<string, string> = {
  'oysters-seafood': '#5BB5E0',
  'cafe-coffee': '#8B4513',
  'restaurant-pub': '#f47b5c',
  'fish-chips-takeaway': '#1E90FF',
  'gallery-art': '#9370DB',
  'boutique-fashion': '#FF69B4',
  'homeware-interiors': '#32CD32',
  'books-records': '#DAA520',
  'deli-food': '#FF8C00',
  'gifts-souvenirs': '#DC143C',
  'antiques-vintage': '#8B0000',
  'harbour-stalls': '#2F4F4F',
  'services': '#696969',
  'accommodation': '#4169E1',
};

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const DAYS_DISPLAY: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export const MAP_MARKERS = {
  parking: [
    { lat: 51.3612, lng: 1.0245, name: 'Harbour Street Car Park' },
    { lat: 51.3598, lng: 1.0268, name: 'Gorrell Tank Car Park' },
    { lat: 51.3585, lng: 1.0295, name: 'Stream Walk Car Park' },
  ],
  toilets: [
    { lat: 51.3605, lng: 1.0248, name: 'Harbour Street Toilets' },
    { lat: 51.3621, lng: 1.0235, name: 'Tankerton Slopes Toilets' },
  ],
  beach: [
    { lat: 51.3625, lng: 1.0220, name: 'Tankerton Beach' },
    { lat: 51.3615, lng: 1.0255, name: 'Whitstable Beach' },
  ],
  atm: [
    { lat: 51.3602, lng: 1.0262, name: 'Lloyds Bank' },
    { lat: 51.3595, lng: 1.0270, name: 'Nationwide' },
  ],
};

export const REVIEW_MAX_PER_DAY = 3;
export const VIEW_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour
