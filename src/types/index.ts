export type Marketplace = 'Ozon' | 'Wildberries' | 'Avito' | 'AliExpress';

export interface MarketplaceOffer {
  id: string;
  marketplace: Marketplace;
  title: string;
  price: number;
  currency: string;
  url: string;
  rating?: number;
  imageUrl?: string;
}

export interface VideoGuide {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  durationLabel: string;
}

export interface PartCategory {
  id: string;
  name: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: number;
}

export interface RideSpot {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  authorName: string;
  likes: number;
  createdAt: number;
}
