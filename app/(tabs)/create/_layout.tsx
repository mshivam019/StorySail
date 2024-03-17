import { Stack } from "expo-router";

const StackLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="index" />
		</Stack>
	);
};

export default StackLayout;
