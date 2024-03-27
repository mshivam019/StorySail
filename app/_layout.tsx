import React from "react";
import { AuthProvider } from "../provider/AuthProvider";
import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootLayout = () => {
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
								}}
							/>
							<Stack.Screen
								name="login"
								options={{
									headerShown: false,
								}}
							/>
							<Stack.Screen name="profile" />
							<Stack.Screen name="settings" />
							<Stack.Screen
								name="(tabs)"
								options={{
									headerShown: false,
								}}
							/>
						</Stack>
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
			</AuthProvider>
		</SafeAreaProvider>
	);
};

export default RootLayout;
