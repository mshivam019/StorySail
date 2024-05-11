import { StyleSheet, Text, Dimensions, View, Pressable } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

function MiniCardItem({
	item,
}: {
	item: {
		id: string;
		title: string;
		posterImageUrl: string;
		category: string;
	};
}) {
	return (
		<Pressable
			style={styles.container}
			onPress={() => {
				router.push(`/home/${item.id}`);
			}}
		>
			<Animated.Image
				style={styles.image}
				source={{ uri: item.posterImageUrl }}
				sharedTransitionTag={`image-${item.id}`}
			/>
			<View style={styles.contentContainer}>
				<Text style={{ fontSize: 20, width: width * 0.5 }}>
					{item.title}
				</Text>
				<Text style={{ fontSize: 16, color: "gray" }}>
					{item.category}
				</Text>
			</View>
		</Pressable>
	);
}

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
		flexDirection: "row",
		alignSelf: "center",
		width: width * 0.8,
		maxWidth: width * 0.8,
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
