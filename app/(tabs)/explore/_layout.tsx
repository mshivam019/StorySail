import { Stack, router } from "expo-router";
import { Pressable, View } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { useAuth } from "../../../provider/AuthProvider";

const StackLayout = () => {
	const { handlePresentModalPress } = useAuth();
	return (
		<Stack
			screenOptions={{
				headerBackground() {
					return (
						<View
							style={{
								flex: 1,
								backgroundColor: "#def6fae3",
							}}
						/>
					);
				},
				headerTitleStyle: {
					fontWeight: "normal",
					fontSize: 25,
					fontFamily: "sans-serif",
				},
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
								handlePresentModalPress &&
									handlePresentModalPress();
							}}
						>
							<Octicons name="gear" size={24} />
						</Pressable>
					</View>
				),
			}}
		>
			<Stack.Screen name="index" options={{ title: "Explore" }} />
		</Stack>
	);
};

export default StackLayout;
