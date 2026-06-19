import { create } from 'zustand';
import { mockRideSpots } from '../data/mock';
import { RideSpot } from '../types';

interface SpotsState {
  spots: RideSpot[];
  likedIds: Set<string>;
  addSpot: (spot: Omit<RideSpot, 'id' | 'createdAt' | 'likes'>) => void;
  toggleLike: (id: string) => void;
}

export const useSpotsStore = create<SpotsState>((set) => ({
  spots: mockRideSpots,
  likedIds: new Set(),
  addSpot: (spot) =>
    set((state) => ({
      spots: [
        {
          ...spot,
          id: `spot-${Date.now()}`,
          likes: 0,
          createdAt: Date.now(),
        },
        ...state.spots,
      ],
    })),
  toggleLike: (id) =>
    set((state) => {
      const liked = state.likedIds.has(id);
      const nextLiked = new Set(state.likedIds);
      liked ? nextLiked.delete(id) : nextLiked.add(id);
      return {
        likedIds: nextLiked,
        spots: state.spots.map((s) => (s.id === id ? { ...s, likes: s.likes + (liked ? -1 : 1) } : s)),
      };
    }),
}));
