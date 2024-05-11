import { Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import Animated, {
	runOnJS,
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

function TabButtons({ buttons, selectedTab, setSelectedTab }: TabButtonsProps) {
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
					const textColor = index === selectedTab ? "black" : "white";
					return (
						<Pressable
							key={button.title}
							onPress={() => {
								onTabPress(index);
							}}
							style={{
								flex: 1,
								paddingVertical: 20,
							}}
						>
							<Animated.Text
								style={{
									textAlign: "center",
									fontSize: 16,
									fontWeight: "bold",

									color: textColor,
								}}
							>
								{button.title}
							</Animated.Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}

export default TabButtons;

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		backgroundColor: "#7dcaf0",
		borderRadius: 20,
		marginVertical: 10,
	},
});
