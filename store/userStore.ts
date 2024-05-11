import { create } from "zustand";
import { persist , createJSONStorage } from "zustand/middleware";

import { User, PostgrestError } from "@supabase/supabase-js";
import zustandStorage from "./zustandStore";
import { supabase } from "../lib/supabase";

export interface UserDetails {
	username: string;
	website: string;
	avatar_url: string;
	full_name: string;
	coins: number;
	lastRewardDate: Date;
}

export interface UserStore {
	isFirstLogin: boolean;
	setIsFirstLogin: (state: boolean) => void;
	user: User | null;
	setUser: (state: User | null) => void;
	userDetails: UserDetails;
	setUserDetails: (state: UserDetails) => void;
	showNotification: boolean;
	setShowNotification: (state: boolean) => void;
	getCoins: () => number;
	deductCoins: (state: number) => Promise<PostgrestError | null>;
	getLastRewardDate: () =>Date;
	setLastRewardDate: (state:Date) => Promise<PostgrestError | null>;
	addCoins: (state: number) => Promise<PostgrestError | null>;
}

const useUserStore = create<UserStore>()(
	persist(
		(set, get) => ({
			isFirstLogin: true as boolean,
			setIsFirstLogin: (state: boolean) => {
				set({
					isFirstLogin: state,
				});
			},
			user: null as User | null,
			setUser: (state: User | null) => {
				set({
					user: state,
				});
			},
			userDetails: {
				coins: 0,
				username: "username",
				website: "",
				avatar_url: "https://www.gravatar.com/avatar/?d=identicon",
				full_name: "Your name here!",
				lastRewardDate: new Date("2021-01-01T00:00:00Z"),
			},
			setUserDetails: (state: UserDetails) => {
				set({
					userDetails: state,
				});
			},
			showNotification: false as boolean,
			setShowNotification: (state: boolean) => {
				set({
					showNotification: state,
				});
			},
			getCoins: () => get().userDetails.coins,
			deductCoins: async (state: number) => {
				const updates = {
					id: get().user?.id,
					coins: get().userDetails.coins - state,
				};
				set({
					userDetails: {
						...get().userDetails,
						coins: updates.coins,
					},
				});

				const { error } = await supabase
					.from("profiles")
					.upsert(updates);
				if (error) {
					set({
						userDetails: {
							...get().userDetails,
							coins: get().userDetails.coins + state,
						},
					});
				}
				return error;
			},
			addCoins: async (state: number) => {
				const updates = {
					id: get().user?.id,
					coins: get().userDetails.coins + state,
				};
				set({
					userDetails: {
						...get().userDetails,
						coins: updates.coins,
					},
				});

				const { error } = await supabase
					.from("profiles")
					.upsert(updates);
				if (error) {
					set({
						userDetails: {
							...get().userDetails,
							coins: get().userDetails.coins - state,
						},
					});
				}
				return error;
			},
			getLastRewardDate: () => get().userDetails.lastRewardDate,
			setLastRewardDate: async (date) => {
				const updates = {
					id: get().user?.id,
					lastRewardDate: new Date(date),
				};
				set({
					userDetails: {
						...get().userDetails,
						lastRewardDate: new Date(date),
					},
				});
				const { error } = await supabase
					.from("profiles")
					.upsert(updates);
				if (error) {
					set({
						userDetails: {
							...get().userDetails,
							lastRewardDate: new Date("2021-01-01T00:00:00Z"),
						},
					});
				}
				return error;
			},
		}),
		{
			name: "user-storage",
			storage: createJSONStorage(() => zustandStorage),
		}
	)
);

export default useUserStore;
