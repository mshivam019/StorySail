import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Animated, {
	interpolateColor,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

export type TabButtonTypes = {
	title: string;
};

type TabButtonsProps = {
	buttons: TabButtonTypes[];
	selectedTab: number;
	setSelectedTab: (index: number) => void;
};

const TabButtons = ({
	buttons,
	selectedTab,
	setSelectedTab,
}: TabButtonsProps) => {
	const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
	const tabPositionX = useSharedValue(0);

	const onTabPress = (index: number) => {
		tabPositionX.value = withTiming(
			(dimensions.width / buttons.length) * index,
			{
				duration: 200,
			},
			() => {
				runOnJS(setSelectedTab)(index);
			}
		);
	};

	const animatedStyle = {
		transform: [
			{
				translateX: tabPositionX,
			},
		],
	};
	return (
		<View style={styles.container} accessibilityRole="tablist">
			<Animated.View
				style={{
					...animatedStyle,
					position: "absolute",
					backgroundColor: "white",
					borderRadius: 15,
					height: dimensions.height - 10,
					marginHorizontal: 5,
					width: dimensions.width / buttons.length - 10,
				}}
			/>
			<View
				style={{ flexDirection: "row" }}
				onLayout={(event) => {
					const { width, height } = event.nativeEvent.layout;
					setDimensions({ height, width });
				}}
			>
				{buttons.map((button, index) => {
					const textColor = useAnimatedStyle(() => {
						const color = interpolateColor(
							index === selectedTab ? 0 : 1,
							[0, 1],
							["#000", "#fff"]
						);

						return {
							color,
						};
					});
					return (
						<Pressable
							key={index}
							onPress={() => {
								onTabPress(index);
							}}
							style={{
								flex: 1,
								paddingVertical: 20,
							}}
						>
							<Animated.Text
								style={[
									{
										textAlign: "center",
										fontSize: 16,
										fontWeight: "bold",
									},
									textColor,
								]}
							>
								{button.title}
							</Animated.Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
};

export default TabButtons;

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		backgroundColor: "#7dcaf0",
		borderRadius: 20,
		marginVertical: 10,
	},
});
