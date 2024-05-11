import { create } from "zustand";
import { persist , createJSONStorage } from "zustand/middleware";
import zustandStorage from "./zustandStore";

export interface CarouselImage {
	id: number;
	imageUrl: string;
}

export interface Category {
	id: number;
	name: string;
	imageUrl: string;
}

export interface FeaturedPost {
	id: string;
	title: string;
	starsCount: number;
	posterImageUrl: string;
	category: string;
}

export interface TrendingPost {
	id: string;
	title: string;
	starsCount: number;
	posterImageUrl: string;
	category: string;
}

export interface AppHome {
	active: number;
	carousel_images: {
		carouselImages: CarouselImage[];
	};
	categories: {
		categories: Category[];
	};
	created_at: string;
	featured_posts: {
		featuredPosts: FeaturedPost[];
	};
	id: number;
	trending_posts: {
		trendingPosts: TrendingPost[];
	};
}

export interface HomeStore {
	data: AppHome | null;
	setData: (state: any) => void;
	lastFetch: Date;
	setLastFetch: (state: Date) => void;
	refetchFlag: boolean;
	setRefetchFlag: (state: boolean) => void;
}

const useHomeStore = create<HomeStore>()(
	persist(
		(set, get) => ({
			data: null,
			setData: (state) => {
				set({ data: state });
			},
			lastFetch: new Date("2021-01-01T00:00:00Z"),
			setLastFetch: (state: Date) => {
				set({ lastFetch: state });
			},
			refetchFlag: false,
			setRefetchFlag: (state: boolean) => {
				set({ refetchFlag: state });
			},
		}),
		{
			name: "notification-storage",
			storage: createJSONStorage(() => zustandStorage),
		}
	)
);

export default useHomeStore;
