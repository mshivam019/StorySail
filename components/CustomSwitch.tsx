import { StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import Animated, {
	interpolateColor,
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
	useDerivedValue,
} from "react-native-reanimated";

function Switch({
	activeColor,
	inActiveColor,
    active,
    setActive,
	callBackfn = () => {},
}: {
	activeColor: string;
	inActiveColor: string;
    active: boolean;
    setActive: (state: boolean) => void;
	callBackfn?: () => void;
}) {
	// value for Switch Animation
	const switchTranslate = useSharedValue(0);
	// state for activate Switch
	
	// Progress Value
	const progress = useDerivedValue(() => withTiming(active ? 22 : 0));

	// useEffect for change the switchTranslate Value
	useEffect(() => {
		if (active) {
			switchTranslate.value = 22;
		} else {
			switchTranslate.value = 4;
		}
	}, [active, switchTranslate]);

	// Circle Animation
	const customSpringStyles = useAnimatedStyle(() => ({
			transform: [
				{
					translateX: withSpring(switchTranslate.value, {
						mass: 1,
						damping: 15,
						stiffness: 120,
						overshootClamping: false,
						restSpeedThreshold: 0.001,
						restDisplacementThreshold: 0.001,
					}),
				},
			],
		}));

	// Background Color Animation
	const backgroundColorStyle = useAnimatedStyle(() => {
		const backgroundColor = interpolateColor(
			progress.value,
			[0, 22],
			[inActiveColor, activeColor]
		);
		return {
			backgroundColor,
		};
	});

	return (
		<Pressable
			onPress={() => {
				setActive(!active);
				callBackfn();
			}}
		>
			<Animated.View style={[styles.container, backgroundColorStyle]}>
				<Animated.View style={[styles.circle, customSpringStyles]} />
			</Animated.View>
		</Pressable>
	);
}

export default Switch;

const styles = StyleSheet.create({
	container: {
		width: 50,
		height: 28,
		borderRadius: 30,
		justifyContent: "center",
		backgroundColor: "#F2F5F7",
	},
	circle: {
		width: 24,
		height: 24,
		borderRadius: 30,
		backgroundColor: "white",
		shadowColor: "black",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 2.5,
		elevation: 4,
	},
});
