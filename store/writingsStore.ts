import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const zustandStorage = {
	setItem: (name: string, value: string | number | boolean | Uint8Array) => {
		return storage.set(name, value);
	},
	getItem: (name: string) => {
		const value = storage.getString(name);
		return value ?? null;
	},
	removeItem: (name: string) => {
		return storage.delete(name);
	},
};

export interface article {
	title: string;
	content: string;
	img: string;
	date: Date;
}

export interface writingsStore {
	articles: article[];
	setArticles: (state: article[]) => void;
	addArticle: (state: article) => Error | void;
	removeArticle: (state: string) => void;
}

const useWritingsStore: () => writingsStore = create<writingsStore>()(
	persist(
		(set, get) => ({
			articles: [] as article[],
			setArticles: (state: article[]) => {
				set({
					articles: state,
				});
			},
			addArticle: (state: article): Error | void => {
				//check if article already exists with the same title
				const exists = get().articles.find(
					(article) => article.title === state.title
				);
				if (exists) {
					return new Error("Article already exists!");
				}
				set({
					articles: [...get().articles, state],
				});
			},
			removeArticle: (state: string) => {
				set({
					articles: get().articles.filter(
						(article) => article.title !== state
					),
				});
			},
		}),
		{
			name: "writings-storage",
			storage: createJSONStorage(() => zustandStorage),
		}
	)
);

export default useWritingsStore;
