import { Theme } from '../types';

export const AVAILABLE_THEMES: Theme[] = [
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm sunset lighting',
    icon: '🌅',
    gradient: ['#F6D365', '#FDA085'],
  },
  {
    id: 'urban-chic',
    name: 'Urban Chic',
    description: 'City street style',
    icon: '🏙️',
    gradient: ['#667EEA', '#764BA2'],
  },
  {
    id: 'beach-vibes',
    name: 'Beach Vibes',
    description: 'Tropical beach setting',
    icon: '🏖️',
    gradient: ['#4FACFE', '#00F2FE'],
  },
  {
    id: 'coffee-date',
    name: 'Coffee Date',
    description: 'Cozy café atmosphere',
    icon: '☕',
    gradient: ['#A18CD1', '#FBC2EB'],
  },
  {
    id: 'adventure',
    name: 'Adventure',
    description: 'Outdoor explorer look',
    icon: '🏔️',
    gradient: ['#11998E', '#38EF7D'],
  },
  {
    id: 'night-out',
    name: 'Night Out',
    description: 'Elegant evening style',
    icon: '🌃',
    gradient: ['#0F2027', '#2C5364'],
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Active & sporty look',
    icon: '💪',
    gradient: ['#F857A6', '#FF5858'],
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Creative studio portrait',
    icon: '🎨',
    gradient: ['#A770EF', '#CF8BF3'],
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Wanderlust aesthetic',
    icon: '✈️',
    gradient: ['#FFB75E', '#ED8F03'],
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean & simple',
    icon: '⬜',
    gradient: ['#E0E0E0', '#BDBDBD'],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro film look',
    icon: '📷',
    gradient: ['#C9A96E', '#8B6914'],
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Lush green backdrop',
    icon: '🌿',
    gradient: ['#56AB2F', '#A8E063'],
  },
];

export const MAX_SELECTED_THEMES = 6;
