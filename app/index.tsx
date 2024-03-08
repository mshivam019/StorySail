import { ActivityIndicator, View } from "react-native";

const StartPage = () => {
	return (
		<View style={{ flex: 1, justifyContent: "center" }}>
			<ActivityIndicator size="large" color="#000" />
		</View>
	);
};

export default StartPage;
