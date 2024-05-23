import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const zustandStorage = {
	setItem: (name: string, value: any) => storage.set(name, value),
	getItem: (name: string) => {
		const value = storage.getString(name);
		return value ?? null;
	},
	removeItem: (name: string) => storage.delete(name),
};

export const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: zustandStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
