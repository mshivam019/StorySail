import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const zustandStorage = {
	setItem: (name: string, value: any) => {
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

const supabaseUrl = "https://iawrnpgcvsjmwdgpkaav.supabase.co";
const supabaseAnonKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhd3JucGdjdnNqbXdkZ3BrYWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4ODYxMzMsImV4cCI6MjAyNTQ2MjEzM30.9xk7DrUOAXrxHZN3ctIV32uisn4amMEIRJoNrv6uGYA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: zustandStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
