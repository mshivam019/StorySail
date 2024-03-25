import React, { useRef } from "react";
import { AuthProvider } from "../provider/AuthProvider";
import "react-native-gesture-handler";
import { Pressable } from "react-native";
import { Stack } from "expo-router";
import {
	BottomSheetModalProvider,
	BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CustomBottomSheetModal } from "../components";
import { AntDesign } from "@expo/vector-icons";

const RootLayout = () => {
	const bottomSheetRef = useRef<BottomSheetModal>(null);

	const handlePresentModalPress = () => bottomSheetRef.current?.present();
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
						<CustomBottomSheetModal ref={bottomSheetRef} />
						<Stack
							initialRouteName="login"
							screenOptions={{
								headerTitle: "Expobase",
								headerRight: () => (
									<Pressable
										onPress={() => {
											handlePresentModalPress();
										}}
									>
										<AntDesign name="setting" size={24} />
									</Pressable>
								),
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
							<Stack.Screen name="(tabs)" />
						</Stack>
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
			</AuthProvider>
		</SafeAreaProvider>
	);
};

export default RootLayout;
