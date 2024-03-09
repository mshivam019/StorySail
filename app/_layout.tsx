import { Slot, useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import AppProvider from "../context/AppContext";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useUserStore } from "../store";
import * as SplashScreen from "expo-splash-screen";
import "react-native-gesture-handler";

interface InitialLayoutProps {
	session: Session | null;
}

const InitialLayout = ({ session }: InitialLayoutProps) => {
	const router = useRouter();
	const { isFirstLogin } = useUserStore() as { isFirstLogin: boolean };
	useEffect(() => {
		if (session && session.user) {
			if (isFirstLogin) {
				router.replace("/onboarding");
			} else router.replace("/one");
		} else {
			router.replace("/login");
		}
	}, [session, isFirstLogin]);

	return <Slot />;
};

const RootLayout = () => {
	const [session, setSession] = useState<Session | null>(null);

	const [appIsReady, setAppIsReady] = useState(false);
	useEffect(() => {
		async function prepare() {
			try {
				// Pre-load fonts, make any API calls you need to do here
				supabase.auth.getSession().then(({ data: { session } }) => {
					setSession(session);
				});

				supabase.auth.onAuthStateChange((_event, session) => {
					setSession(session);
				});
			} catch (e) {
				console.log(e);
			} finally {
				// Tell the application to render
				setAppIsReady(true);
			}
		}

		prepare();
	}, []);
	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			// This tells the splash screen to hide immediately! If we call this after
			// `setAppIsReady`, then we may see a blank screen while the app is
			// loading its initial state and rendering its first pixels. So instead,
			// we hide the splash screen once we know the root view has already
			// performed layout.
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return null;
	}
	return (
		<View onLayout={onLayoutRootView} style={{ flex: 1 }}>
			<AppProvider sess={session}>
				<InitialLayout session={session} />
			</AppProvider>
		</View>
	);
};

export default RootLayout;
