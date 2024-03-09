import { useRef, useState } from "react";
import { View, Text, Dimensions, StyleSheet, Pressable } from "react-native";
import { useUserStore } from "../store";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import LottieView from "lottie-react-native";

const Onboarding = () => {
	const { setIsFirstLogin } = useUserStore() as {
		setIsFirstLogin: (value: boolean) => void;
	};
	const [activeSlide, setActiveSlide] = useState(0);
	const { width } = Dimensions.get("window");
	const carouselRef = useRef<ICarouselInstance>(null);
	const onboardingData = [
		{
			animation: require("../assets/onboarding/onboarding1.json"),
			backgroundColor: "#fff3cc",
			footerColor: "#f8eabd",
			title: "Welcome to the app!",
		},
		{
			animation: require("../assets/onboarding/onboarding2.json"),
			backgroundColor: "#f5e3e3",
			footerColor: "#f9d7d7",
			title: "Hope you enjoy it",
		},
		{
			animation: require("../assets/onboarding/onboarding3.json"),
			backgroundColor: "#ccdef8",
			footerColor: "#c1dafd",
			title: "Let's get started",
		},
	];
	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor:
						onboardingData[activeSlide].backgroundColor,
				},
			]}
		>
			<Carousel
				ref={carouselRef}
				loop
				height={400}
				autoPlay
				autoPlayInterval={2000}
				width={width}
				data={onboardingData}
				renderItem={({ item, index }) => (
					<LottieView
						source={item.animation}
						autoPlay
						loop
						style={{
							width: 400,
							height: 400,
							alignSelf: "baseline",
						}}
					/>
				)}
				onProgressChange={(_offsetProgress, absoluteProgress) => {
					const currentIndex =
						carouselRef.current?.getCurrentIndex() || 0;

					if (absoluteProgress > 0.5 || currentIndex === 0) {
						setActiveSlide(currentIndex);
					}
				}}
			/>
			<Text style={{ fontSize: 30, fontWeight: "bold" }}>
				{onboardingData[activeSlide].title}
			</Text>
			<View style={styles.dotContainer}>
				{onboardingData.map((_, index) => (
					<View
						key={index}
						style={[
							styles.dot,
							activeSlide === index && styles.activeDot,
						]}
					/>
				))}
			</View>
			<View
				style={[
					styles.buttonContainer,
					{
						backgroundColor:
							onboardingData[activeSlide].footerColor,
					},
				]}
			>
				<Pressable
					style={styles.button}
					onPress={() => {
						setIsFirstLogin(false);
					}}
				>
					<Text>Skip</Text>
				</Pressable>
				<Pressable
					style={styles.button}
					onPress={() => {
						if (activeSlide === onboardingData.length - 1) {
							setIsFirstLogin(false);
						} else carouselRef.current?.next();
					}}
				>
					<Text>Next</Text>
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		gap: 10,
		justifyContent: "space-between",
		paddingTop: 30,
	},
	dotContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 10,
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "gray",
	},
	activeDot: {
		backgroundColor: "black",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	button: {
		padding: 10,
		borderRadius: 10,
	},
});

export default Onboarding;
