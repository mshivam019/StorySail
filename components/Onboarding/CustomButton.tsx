import {
	FlatList,
	StyleSheet,
	TouchableWithoutFeedback,
	useWindowDimensions,
} from "react-native";
import React from "react";
import Animated, {
	AnimatedRef,
	SharedValue,
	interpolateColor,
	useAnimatedStyle,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { useUserStore } from "../../store";
import { OnboardingData } from "../../data";

type Props = {
	dataLength: number;
	flatListIndex: SharedValue<number>;
	flatListRef: AnimatedRef<FlatList<OnboardingData>>;
	x: SharedValue<number>;
};

function CustomButton({ flatListRef, flatListIndex, dataLength, x }: Props) {
	const { width: SCREEN_WIDTH } = useWindowDimensions();
	const { setIsFirstLogin } = useUserStore();

	const buttonAnimationStyle = useAnimatedStyle(() => ({
			width:
				flatListIndex.value === dataLength - 1
					? withSpring(140)
					: withSpring(60),
			height: 60,
		}));

	const arrowAnimationStyle = useAnimatedStyle(() => ({
			width: 30,
			height: 30,
			opacity:
				flatListIndex.value === dataLength - 1
					? withTiming(0)
					: withTiming(1),
			transform: [
				{
					translateX:
						flatListIndex.value === dataLength - 1
							? withTiming(100)
							: withTiming(0),
				},
			],
		}));

	const textAnimationStyle = useAnimatedStyle(() => ({
			opacity:
				flatListIndex.value === dataLength - 1
					? withTiming(1)
					: withTiming(0),
			transform: [
				{
					translateX:
						flatListIndex.value === dataLength - 1
							? withTiming(0)
							: withTiming(-100),
				},
			],
		}));
	const animatedColor = useAnimatedStyle(() => {
		const backgroundColor = interpolateColor(
			x.value,
			[0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
			["#F15937","#000","#1e2169"]
		);

		return {
			backgroundColor,
		};
	});

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				if (flatListIndex.value < dataLength - 1) {
					flatListRef.current?.scrollToIndex({
						index: flatListIndex.value + 1,
					});
				} else {
					setIsFirstLogin(false);
					router.replace("/home");
				}
			}}
		>
			<Animated.View
				style={[styles.container, buttonAnimationStyle, animatedColor]}
			>
				<Animated.Text style={[styles.textButton, textAnimationStyle]}>
					Get Started
				</Animated.Text>
				<Animated.Image
					source={require("../../assets/images/ArrowIcon.png")}
					style={[styles.arrow, arrowAnimationStyle]}
				/>
			</Animated.View>
		</TouchableWithoutFeedback>
	);
}

export default CustomButton;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#1e2169",
		padding: 10,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
	},
	arrow: {
		position: "absolute",
	},
	textButton: { color: "white", fontSize: 16, position: "absolute" },
});
