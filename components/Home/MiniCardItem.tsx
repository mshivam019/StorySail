import { StyleSheet, Text, Dimensions, View, Pressable } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
import { router } from "expo-router";
const { width } = Dimensions.get("window");

const MiniCardItem = ({ row, column }: { row: number; column: number }) => {
	const id = row * 3 + column + 1;
	const data = [
		{
			id: 1,
			title: "The art of war",
			subtitle: "Sun Tzu",
			image: require("../../assets/home/carousel/1.jpg"),
		},
		{
			id: 2,
			title: "The Alchemist",
			subtitle: "Paulo Coelho",
			image: require("../../assets/home/carousel/2.jpg"),
		},
		{
			id: 3,
			title: "The Great Gatsby",
			subtitle: "F. Scott Fitzgerald",
			image: require("../../assets/home/carousel/3.jpg"),
		},
		{
			id: 4,
			title: "The Catcher in the Rye",
			subtitle: "J.D. Salinger",
			image: require("../../assets/home/carousel/4.jpg"),
		},
		{
			id: 5,
			title: "The Hobbit",
			subtitle: "J.R.R. Tolkien",
			image: require("../../assets/home/carousel/5.jpg"),
		},
		{
			id: 6,
			title: "The Hitchhiker's Guide to the Galaxy",
			subtitle: "Douglas Adams",
			image: require("../../assets/home/carousel/6.jpg"),
		},
	];
	return (
		<Pressable
			style={styles.container}
			onPress={() => {
				router.push(`/home/${data[id - 1].title}`);
			}}
		>
			<Animated.Image
				style={styles.image}
				source={data[id - 1].image}
				sharedTransitionTag={`image-${data[id - 1].title}`}
			/>
			<View style={styles.contentContainer}>
				<Text style={{ fontSize: 20, width: width * 0.5 }}>
					{data[id - 1].title}
				</Text>
				<Text style={{ fontSize: 16, color: "gray" }}>
					{data[id - 1].subtitle}
				</Text>
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
