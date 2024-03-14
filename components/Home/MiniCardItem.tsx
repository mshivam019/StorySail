import { StyleSheet, Text, Dimensions, View, Pressable } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
import { router } from "expo-router";
const { width } = Dimensions.get("window");

const MiniCardItem = ({ row, column }: { row: number; column: number }) => {
	const id = row * 3 + column + 1;
	const source = [
		require("../../assets/home/carousel/1.jpg"),
		require("../../assets/home/carousel/2.jpg"),
		require("../../assets/home/carousel/3.jpg"),
		require("../../assets/home/carousel/4.jpg"),
		require("../../assets/home/carousel/5.jpg"),
		require("../../assets/home/carousel/6.jpg"),
	];
	return (
		<Pressable
			style={styles.container}
			onPress={() => {
				router.push(`/home/${id}`);
			}}
		>
			<Animated.Image
				style={styles.image}
				source={source[id - 1]}
				sharedTransitionTag={`image-${id}`}
			/>
			<View style={styles.contentContainer}>
				<Text style={{ fontSize: 20, width: width * 0.5 }}>
					Beautiful Nature
				</Text>
				<Text style={{ fontSize: 16, color: "gray" }}>Nature</Text>
			</View>
		</Pressable>
	);
};

export default MiniCardItem;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		borderRadius: 16,
		margin: 10,
		overflow: "hidden",
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		padding: 10,
		width: width * 0.8,
		flexDirection: "row",
	},
	image: {
		width: 100,
		height: 100,
		padding: 10,
		borderRadius: 16,
	},
	contentContainer: {
		padding: 10,
	},
});
