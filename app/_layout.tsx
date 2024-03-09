import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../provider/AuthProvider";
import { useUserStore } from "../store";
import "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
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
		<SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
			<AuthProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<BottomSheetModalProvider>
						<InitialLayout />
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
			</AuthProvider>
		</SafeAreaView>
	);
};

export default RootLayout;
