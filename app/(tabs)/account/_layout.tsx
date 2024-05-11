import { Stack, router } from "expo-router";
import { Pressable, View } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { useAuth } from "../../../provider/AuthProvider";

function StackLayout() {
	const { handlePresentModalPress = () => {} } = useAuth();
	return (
		<Stack
			screenOptions={{
				headerRight: () => (
					<View style={{ flexDirection: "row", gap: 20 }}>
						<Pressable
							onPress={() => {
								router.push("notifications");
							}}
						>
							<Octicons name="bell" size={24} />
						</Pressable>
						<Pressable
							onPress={() => {
								handlePresentModalPress();
							}}
						>
							<Octicons name="gear" size={24} />
						</Pressable>
					</View>
				),
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "Account",
					headerTitleStyle: {
						fontWeight: "normal",
						fontSize: 25,
						fontFamily: "sans-serif",
					},
					headerTransparent: true,
				}}
			/>
		</Stack>
	);
}

export default StackLayout;
