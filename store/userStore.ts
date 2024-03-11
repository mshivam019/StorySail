import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { supabase } from "../lib/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

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
}

export interface UserStore {
	isFirstLogin: boolean;
	setIsFirstLogin: (state: boolean) => void;
	userDetails: UserDetails;
	setUserDetails: (state: UserDetails) => void;
    showNotification: boolean;
    setShowNotification: (state: boolean) => void;
    signOut: () => void;
}

const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			isFirstLogin: true,
			setIsFirstLogin: (state: boolean) => {
				set({
					isFirstLogin: state,
				});
			},
			userDetails: {
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
            signOut: async () => {
                supabase.auth.signOut().then(() => {
                    GoogleSignin.signOut();
                });
                set({
                    userDetails: {
						username: "username",
						website: "",
						avatar_url: "https://www.gravatar.com/avatar/?d=identicon",
						full_name: "Your name here!",
					},
                });
            },
            showNotification: false,
            setShowNotification: (state: boolean) => {
                set({
                    showNotification: state,
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
