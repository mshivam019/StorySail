import { Slot, useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import AppProvider from "../context/AppContext";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useUserStore } from "../store";
import * as SplashScreen from "expo-splash-screen";
import "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

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
			} else router.replace("/home");
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
		<SafeAreaView onLayout={onLayoutRootView} style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
			<AppProvider sess={session}>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<BottomSheetModalProvider>
						<InitialLayout session={session} />
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
			</AppProvider>
		</SafeAreaView>
	);
};

export default RootLayout;
