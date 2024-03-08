import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iawrnpgcvsjmwdgpkaav.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhd3JucGdjdnNqbXdkZ3BrYWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4ODYxMzMsImV4cCI6MjAyNTQ2MjEzM30.9xk7DrUOAXrxHZN3ctIV32uisn4amMEIRJoNrv6uGYA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
