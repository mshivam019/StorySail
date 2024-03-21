import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { User, PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

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
	getLastRewardDate: () => Date;
	setLastRewardDate: () => Promise<PostgrestError | null>;
	addCoins: (state: number) => Promise<PostgrestError | null>;
}

const useUserStore: () => UserStore = create<UserStore>()(
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
			getCoins: () => {
				return get().userDetails.coins;
			},
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
			getLastRewardDate: () => {
				return get().userDetails.lastRewardDate;
			},
			setLastRewardDate: async () => {
				const updates = {
					id: get().user?.id,
					lastRewardDate: new Date(),
				};
				set({
					userDetails: {
						...get().userDetails,
						lastRewardDate: new Date(),
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
