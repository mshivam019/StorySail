import { View,Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const AnimatedSplashScreen = () => {
	const { width, height } = Dimensions.get("window");
	return (
		<View style={{ flex: 1,backgroundColor:'#9356ff' }}>
			<LottieView
				source={require("../assets/splash.json")}
				autoPlay
				loop={true}
				speed={3}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					width: width,
					height: height,
				}}
			/>
		</View>
	);
};

export default AnimatedSplashScreen;
