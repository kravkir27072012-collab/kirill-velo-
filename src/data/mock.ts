import { MarketplaceOffer, PartCategory, RideSpot, VideoGuide } from '../types';

export const partCategories: PartCategory[] = [
  { id: 'chain', name: 'Цепь', icon: 'link' },
  { id: 'brake-pads', name: 'Тормозные колодки', icon: 'disc' },
  { id: 'derailleur', name: 'Переключатель скоростей', icon: 'settings' },
  { id: 'cassette', name: 'Кассета', icon: 'layers' },
  { id: 'tire', name: 'Покрышка', icon: 'circle' },
  { id: 'inner-tube', name: 'Камера', icon: 'circle-dot' },
  { id: 'brake-cable', name: 'Тросик тормоза', icon: 'minus' },
  { id: 'pedals', name: 'Педали', icon: 'square' },
  { id: 'saddle', name: 'Седло', icon: 'square-asterisk' },
  { id: 'grips', name: 'Грипсы / руль', icon: 'grip' },
];

export const popularBikeModels = [
  'Stark Slash 27.5',
  'Trek Marlin 7',
  'Stels Navigator 700',
  'Giant Talon 3',
  'Cube Aim',
  'Merida Big Nine',
];

function offersForQuery(query: string): MarketplaceOffer[] {
  const base = query.trim() || 'запчасть';
  return [
    {
      id: 'ozon-1',
      marketplace: 'Ozon',
      title: `${base} — совместимая, для большинства моделей`,
      price: 890,
      currency: '₽',
      url: `https://www.ozon.ru/search/?text=${encodeURIComponent(base)}`,
      rating: 4.7,
    },
    {
      id: 'wb-1',
      marketplace: 'Wildberries',
      title: `${base}, оригинал`,
      price: 1190,
      currency: '₽',
      url: `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(base)}`,
      rating: 4.5,
    },
    {
      id: 'avito-1',
      marketplace: 'Avito',
      title: `${base}, б/у и новые объявления рядом с вами`,
      price: 600,
      currency: '₽',
      url: `https://www.avito.ru/rossiya?q=${encodeURIComponent(base)}`,
      rating: 4.2,
    },
    {
      id: 'ali-1',
      marketplace: 'AliExpress',
      title: `${base}, доставка из-за рубежа`,
      price: 540,
      currency: '₽',
      url: `https://aliexpress.ru/wholesale?SearchText=${encodeURIComponent(base)}`,
      rating: 4.4,
    },
  ];
}

export function searchMarketplaceOffers(partName: string, bikeModel: string): MarketplaceOffer[] {
  return offersForQuery(`${partName} ${bikeModel}`.trim());
}

export function searchBikeOffers(bikeModel: string): MarketplaceOffer[] {
  const base = bikeModel.trim() || 'велосипед';
  return [
    {
      id: 'ozon-bike',
      marketplace: 'Ozon',
      title: `Велосипед ${base}`,
      price: 24990,
      currency: '₽',
      url: `https://www.ozon.ru/search/?text=${encodeURIComponent(base)}`,
      rating: 4.6,
    },
    {
      id: 'wb-bike',
      marketplace: 'Wildberries',
      title: `Велосипед ${base}, в сборе`,
      price: 26490,
      currency: '₽',
      url: `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(base)}`,
      rating: 4.4,
    },
    {
      id: 'avito-bike',
      marketplace: 'Avito',
      title: `${base}, объявления рядом с вами`,
      price: 18000,
      currency: '₽',
      url: `https://www.avito.ru/rossiya?q=${encodeURIComponent(base)}`,
      rating: 4.3,
    },
  ];
}

export function findVideoGuide(partName: string): VideoGuide {
  return {
    id: `video-${partName}`,
    youtubeId: 'dQw4w9WgXcQ',
    title: `Как заменить: ${partName || 'запчасть'} — пошаговая инструкция`,
    channel: 'Велосипедный мастер',
    durationLabel: '8:24',
  };
}

export const mockRideSpots: RideSpot[] = [
  {
    id: 'spot-1',
    title: 'Лесопарк "Сосновый бор"',
    description: 'Грунтовые тропы среди сосен, есть лёгкий и сложный маршрут. Отлично для эндуро и MTB.',
    location: 'Москва, Лосиный остров',
    imageUrl: 'https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae1?w=800',
    authorName: 'Андрей К.',
    likes: 34,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'spot-2',
    title: 'Набережная у залива',
    description: 'Асфальтированная дорожка вдоль воды, 12 км в одну сторону. Идеально для шоссейников.',
    location: 'Санкт-Петербург',
    imageUrl: 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800',
    authorName: 'Мария В.',
    likes: 51,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'spot-3',
    title: 'Горный серпантин',
    description: 'Виды на ущелье, набор высоты 600 м. Маршрут для подготовленных райдеров.',
    location: 'Сочи',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
    authorName: 'Тимур Б.',
    likes: 89,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
  },
];
