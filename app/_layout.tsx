import { Slot, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import AppProvider from "../context/AppContext";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import * as SplashScreen from 'expo-splash-screen';

interface InitialLayoutProps {
	session: Session | null;
}

const InitialLayout = ({ session }: InitialLayoutProps) => {
	const router = useRouter();
	useEffect(() => {
		if (session && session.user) {
			router.replace("/one");
		} else {
			router.replace("/login");
		}
	}, [session]);

	return <Slot />;
};

const RootLayout = () => {
	SplashScreen.preventAutoHideAsync();
	const [session, setSession] = useState<Session | null>(null);
	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
		SplashScreen.hideAsync();
	}, []);
	return (
		<AppProvider session={session}>
			<InitialLayout session={session} />
		</AppProvider>
	);
};

export default RootLayout;
