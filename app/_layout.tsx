import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../provider/AuthProvider";

function RootLayout() {
	return (
		<SafeAreaProvider
			initialMetrics={{
				insets: {
					top: 10,
					left: 0,
					right: 0,
					bottom: 0,
				},
				frame: {
					x: 0,
					y: 0,
					width: 0,
					height: 0,
				},
			}}
		>
			<AuthProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<BottomSheetModalProvider>
						<Stack
							initialRouteName="login"
							screenOptions={{
								headerTitle: "Story Sail",
							}}
						>
							<Stack.Screen
								name="onboarding"
								options={{
									headerShown: false,
									animation: "slide_from_right",
								}}
							/>
							<Stack.Screen
								name="login"
								options={{
									headerShown: false,
									animation: "slide_from_bottom",
								}}
							/>
							<Stack.Screen
								name="profile"
								options={{
									headerTitle: "Profile",
									animation: "slide_from_right",
								}}
							/>
							<Stack.Screen
								name="tc"
								options={{
									headerTitle: "Terms & Conditions",
									animation: "slide_from_right",
								}}
							/>
							<Stack.Screen
								name="(tabs)"
								options={{
									headerShown: false,
									animation: "slide_from_bottom",
								}}
							/>
							<Stack.Screen
								name="notifications"
								options={{
									headerTitle: "Notifications",
									animation: "slide_from_bottom",
								}}
							/>
						</Stack>
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
			</AuthProvider>
		</SafeAreaProvider>
	);
}

export default RootLayout;
