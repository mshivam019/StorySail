import { View, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const Home = () => {
	return (
		<View
			style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
		>
			<ActivityIndicator size="large" color="#000" />
		</View>
	);
};

export default Home;
