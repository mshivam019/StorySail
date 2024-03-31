import { StyleSheet, Text, Dimensions, View, Pressable } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
import { router } from "expo-router";
import { useHomeStore } from "../../store";

const { width } = Dimensions.get("window");


const MiniCardItem = ({ id,widthPercent }: { id: number;widthPercent:number }) => {
	const { data } = useHomeStore();
	if(!data) return null;

	const featuredPosts = data.featured_posts.featuredPosts;
	return (
		<Pressable
			style={[styles.container,{width: width * widthPercent}]}
			onPress={() => {
				router.push(`/home/${featuredPosts[id - 1].id}`);
			}}
		>
			<Animated.Image
				style={styles.image}
				source={{uri:featuredPosts[id - 1].posterImageUrl}}
				sharedTransitionTag={`image-${featuredPosts[id - 1].id}`}
			/>
			<View style={styles.contentContainer}>
				<Text style={{ fontSize: 20, width: width * 0.5 }}>
					{featuredPosts[id - 1].title}
				</Text>
				<Text style={{ fontSize: 16, color: "gray" }}>
					{featuredPosts[id - 1].category}
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
		flexDirection: "row",
		alignSelf: "center",
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
