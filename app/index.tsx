import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Auth from "../components/Auth";
import Account from "../components/Account";
import { SafeAreaView } from "react-native";
import { Session } from "@supabase/supabase-js";
import { Stack } from "expo-router";

export default function App() {
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Stack.Screen options={{ headerShown: false }} />
			{session && session.user ? (
				<Account key={session.user.id} session={session} />
			) : (
				<Auth />
			)}
			<Stack />
		</SafeAreaView>
	);
}
