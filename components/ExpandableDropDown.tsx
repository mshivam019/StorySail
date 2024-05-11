import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, {
	useAnimatedRef,
	useSharedValue,
	useAnimatedStyle,
	runOnUI,
	measure,
	useDerivedValue,
	withTiming,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";

export interface Category {
	title: string;
	content: string[];
}

type Props = {
	data: Category;
	value: string;
	setValue: (value: string) => void;
};

function DropDown({ data, value, setValue }: Props) {
	const listRef = useAnimatedRef();
	const heightValue = useSharedValue(0);
	const open = useSharedValue(false);
	const progress = useDerivedValue(() =>
		open.value ? withTiming(1) : withTiming(0)
	);

	const heightAnimationStyle = useAnimatedStyle(() => ({
		height: heightValue.value,
	}));

	const iconStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${progress.value * -180}deg` }],
	}));

	return (
		<View style={styles.container}>
			<Pressable
				onPress={() => {
					if (heightValue.value === 0) {
						runOnUI(() => {
							"worklet";

							heightValue.value = withTiming(
								measure(listRef)!.height
							);
						})();
					} else {
						heightValue.value = withTiming(0);
					}
					open.value = !open.value;
				}}
				style={styles.titleContainer}
			>
				<Text style={styles.textTitle}>
					{value || data.title}
				</Text>
				<Animated.View style={iconStyle}>
					<MaterialIcons
						name="keyboard-arrow-down"
						size={24}
						color="black"
					/>
				</Animated.View>
			</Pressable>
			<Animated.View style={heightAnimationStyle}>
				<Animated.View style={styles.contentContainer} ref={listRef}>
					{data.content.map((v, i) => (
						<Pressable
							key={i}
							style={styles.content}
							onPress={() => {
								setValue(v);
								heightValue.value = withTiming(0);
								open.value = false;
							}}
						>
							<Text style={styles.textContent}>{v}</Text>
						</Pressable>
					))}
				</Animated.View>
			</Animated.View>
		</View>
	);
}

export default DropDown;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#f5f5f5",
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "#000",
		overflow: "hidden",
	},
	textTitle: {
		fontSize: 16,
		color: "black",
	},
	titleContainer: {
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	contentContainer: {
		position: "absolute",
		width: "100%",
		top: 0,
	},
	content: {
		padding: 20,
		backgroundColor: "#ffffff",
	},
	textContent: {
		fontSize: 14,
		color: "black",
	},
});
