import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./zustandStore";
import { supabase } from "../lib/supabase";
import uuid from "react-native-uuid";
import { Positions } from "../components/Favourites/SortableList/Config";

export interface StarredWriting {
	id: string; // Unique identifier for the starred writing
	user_id: string; // ID of the user who starred the writing
	writing_id: string; // ID of the writing that was starred
	created_at: Date; // Timestamp indicating when the writing was starred
}

export interface StarStore {
	starredWritings: StarredWriting[];
	setStarredWritings: (state: StarredWriting[]) => void;
	starWriting: (writingId: string) => Promise<void>;
	unstarWriting: (writingId: string) => Promise<void>;
	getStarredWritingsByUser: () => Promise<void>;
}

const useStarStore = create<StarStore>()(
	persist(
		(set, get) => ({
			starredWritings: [] as StarredWriting[],
			setStarredWritings: (state: StarredWriting[]) => {
				set({ starredWritings: state });
			},
			starWriting: async (writingId: string) => {
				const currentSession = await supabase.auth.getSession();
				if (!currentSession) {
					console.error("No user logged in");
					return;
				}
				const userId = currentSession?.data.session?.user?.id;
				const starId = uuid.v4().toString();
				const { error } = await supabase
					.from("starred_writings")
					.insert([
						{
							id: starId,
							user_id: userId,
							writing_id: writingId,
						},
					]);
				if (error) {
					console.error("Error starring writing:", error.message);
					return;
				}
				set({
					starredWritings: [
						...get().starredWritings,
						{
							id: starId,
							user_id: userId?.toString() || "",
							writing_id: writingId,
							created_at: new Date(),
						},
					],
				});
			},
			unstarWriting: async (writingId: string) => {
				const currentSession = await supabase.auth.getSession();
				if (!currentSession) {
					console.error("No user logged in");
					return;
				}
				const userId = currentSession?.data.session?.user?.id;
				const { error } = await supabase
					.from("starred_writings")
					.delete()
					.eq("user_id", userId)
					.eq("writing_id", writingId);
				if (error) {
					console.error("Error unstarring writing:", error.message);
					return;
				}
				set({
					starredWritings: get().starredWritings.filter(
						(starredWriting) =>
							starredWriting.writing_id !== writingId
					),
				});
			},
			getStarredWritingsByUser: async () => {
				const currentSession = await supabase.auth.getSession();
				if (!currentSession) {
					console.error("No user logged in");
					return;
				}
				const userId = currentSession?.data.session?.user?.id;
				const { data, error } = await supabase
					.from("starred_writings")
					.select("*")
					.eq("user_id", userId);
				if (error) {
					console.error(
						"Error fetching starred writings:",
						error.message
					);
					return;
				}
				set({ starredWritings: data });
			},
		}),
		{
			name: "star-storage",
			storage: createJSONStorage(() => zustandStorage),
		}
	)
);

export default useStarStore;
