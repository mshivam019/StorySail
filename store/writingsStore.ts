import { create } from "zustand";
import { persist , createJSONStorage } from "zustand/middleware";
import { supabase } from "../lib/supabase";
import zustandStorage from "./zustandStore";


export interface UserWriting {
	id: string; // Unique identifier for the writing
	user_id: string; // ID of the user who created the writing
	title: string;
	content: string;
	category: string;
	tags: string[];
	stars_count: number;
	poster_image_url: string; // URL of the poster image
	created_at: Date; // Timestamp indicating when the writing was created
	updated_at: Date; // Timestamp indicating when the writing was last updated
}

export interface WritingsStore {
	articles: UserWriting[];
	drafts: UserWriting[];
	setArticles: (state: UserWriting[]) => void;
	addArticle: (state: UserWriting) => Promise<Error|String>;
	removeArticle: (id: string) => Promise<void>;
	getArticlesByUser: () => Promise<void>;
	saveDraft: (draft: UserWriting) => void;
	deleteDraft: (id: string) => void;
}

const useWritingsStore = create<WritingsStore>()(
	persist(
		(set, get) => ({
			articles: [] as UserWriting[],
			drafts: [] as UserWriting[], // Initialize drafts array
			setArticles: (state: UserWriting[]) => {
				set({ articles: state });
			},
			addArticle: async (state: UserWriting) => {
				// New article, add it
				const { data, error } = await supabase
					.from("user_writings")
					.upsert(state);

				if (error) {
					console.error("Error adding article:", error.message);
					return new Error(error.message);
				}

				if (state) {
					if(get().articles.length === 0){
						set({ articles: [state] });
						return "Article added successfully";
					}
					// check if the article already exists in the store
					// if it does, update the article
					const newArticles = get().articles.map((article) =>
						article.id === state.id ? state : article
					);
					// if it doesn't, add the article to the store
					if (!newArticles.find((article) => article.id === state.id)) {
						newArticles.push(state);
					}
					set({ articles: newArticles });
					// check if it was a draft
					set({ drafts: get().drafts.filter((draft) => draft.id !== state.id) });
				} else {
					console.error("No data returned after adding article");
				}
				return "Article added successfully";
			},
			removeArticle: async (id: string) => {
				const { error } = await supabase
					.from("user_writings")
					.delete()
					.eq("id", id);
				if (error) {
					console.error("Error removing article:", error.message);
				} else {
					set({
						articles: get().articles.filter(
							(article) => article.id !== id
						),
					});
				}
			},
			getArticlesByUser: async () => {
				const currentSession = await supabase.auth.getSession();
				if (!currentSession) {
					console.error("No user logged in");
					return;
				}
				const userId = currentSession?.data.session?.user?.id;
				const { data, error } = await supabase
					.from("user_writings")
					.select("*")
					.eq("user_id", userId);
				if (error) {
					console.error("Error fetching articles:", error.message);
					return;
				}
				set({ articles: data });
			},
			saveDraft: (draft: UserWriting) => {
				// match id of the new article with the id of the article in the store then update the article
				if(get().drafts.length === 0){
					set({ drafts: [draft] });
					return;
				}
				// check if the draft already exists in the store
				const newDrafts = get().drafts.map((d) =>
					d.id === draft.id ? draft : d
				);
				// if it doesn't, add the draft to the store
				if (!newDrafts.find((d) => d.id === draft.id)) {
					newDrafts.push(draft);
				}
				set({ drafts: newDrafts });
			},
			deleteDraft: (id: string) => {
				set({
					drafts: get().drafts.filter((draft) => draft.id !== id),
				});
			}
		}),
		{
			name: "writings-storage",
			storage: createJSONStorage(() => zustandStorage),
		}
	)
);

export default useWritingsStore;
