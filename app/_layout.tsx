import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../provider/AuthProvider";
import { useUserStore } from "../store";
import "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";

const InitialLayout = () => {
	const router = useRouter();
	const { isFirstLogin } = useUserStore() as { isFirstLogin: boolean };
	const { session, initialized } = useAuth();
	useEffect(() => {
		if (!initialized) return;
		SplashScreen.hideAsync();
		if (session && session.user) {
			if (isFirstLogin) {
				router.replace("/onboarding");
			} else router.replace("/home");
		} else {
			router.replace("/login");
		}
	}, [session, isFirstLogin, initialized]);

	return <Slot />;
};

const RootLayout = () => {
	return (
		<SafeAreaProvider style={{ flex: 1 }}>
			<AuthProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<BottomSheetModalProvider>
						<InitialLayout />
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
			</AuthProvider>
		</SafeAreaProvider>
	);
};

export default RootLayout;
