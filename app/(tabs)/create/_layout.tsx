import { Stack } from "expo-router";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "../../../provider/AuthProvider";

const StackLayout = () => {
	const { handlePresentModalPress } = useAuth();
	return (
		<Stack
			screenOptions={{
				headerRight: () => (
					<Pressable
						onPress={() => {
							handlePresentModalPress &&
								handlePresentModalPress();
						}}
					>
						<AntDesign name="setting" size={24} />
					</Pressable>
				),
			}}
		>
			<Stack.Screen name="index" options={{ title: "Craft" }} />
		</Stack>
	);
};

export default StackLayout;
