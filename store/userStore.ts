import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { User } from "@supabase/supabase-js";

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
	deductCoins: (state: number) => void;
	addCoins: (state: number) => void;
}

const useUserStore = create<UserStore>()(
	persist(
		(set,get) => ({
			isFirstLogin: true,
			setIsFirstLogin: (state: boolean) => {
				set({
					isFirstLogin: state,
				});
			},
			user: null,
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
			},
			setUserDetails: (state: UserDetails) => {
				set({
					userDetails: state,
				});
			},
            showNotification: false,
            setShowNotification: (state: boolean) => {
                set({
                    showNotification: state,
                });
            },
			getCoins: () => {
				return get().userDetails.coins;
			},
			deductCoins: (state: number) => {
				set({
					userDetails: {
						...get().userDetails,
						coins: get().userDetails.coins - state,
					},
				});
			},
			addCoins: (state: number) => {
				set({
					userDetails: {
						...get().userDetails,
						coins: get().userDetails.coins + state,
					},
				});
			},
		}),
		{
			name: "user-storage",
			storage: createJSONStorage(() => zustandStorage),
		}
	)
);

export default useUserStore;
