import React, { useState,useRef } from "react";
import { StyleSheet, Text, ScrollView, Pressable, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Animated from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import { Toast,ToastRef } from "../../../components";

const Details = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const toastRef = useRef<ToastRef>(null);
	const data = [
		{
			id: 1,
			title: "The art of war",
			subtitle: "Sun Tzu",
			image: require("../../../assets/home/carousel/1.jpg"),
			description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,sunt in culpa qui officia deserunt mollit anim id est laborum.",
			likeStatus: false,
		},
		{
			id: 2,
			title: "The Alchemist",
			subtitle: "Paulo Coelho",
			image: require("../../../assets/home/carousel/2.jpg"),
			description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,sunt in culpa qui officia deserunt mollit anim id est laborum.",
			likeStatus: false,
		},
		{
			id: 3,
			title: "The Great Gatsby",
			subtitle: "F. Scott Fitzgerald",
			image: require("../../../assets/home/carousel/3.jpg"),
			description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,sunt in culpa qui officia deserunt mollit anim id est laborum.",
			likeStatus: false,
		},
		{
			id: 4,
			title: "The Catcher in the Rye",
			subtitle: "J.D. Salinger",
			image: require("../../../assets/home/carousel/4.jpg"),
			description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,sunt in culpa qui officia deserunt mollit anim id est laborum.",
			likeStatus: false,
		},
		{
			id: 5,
			title: "The Hobbit",
			subtitle: "J.R.R. Tolkien",
			image: require("../../../assets/home/carousel/5.jpg"),
			description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,sunt in culpa qui officia deserunt mollit anim id est laborum.",
			likeStatus: true,
		},
		{
			id: 6,
			title: "The Hitchhiker's Guide to the Galaxy",
			subtitle: "Douglas Adams",
			image: require("../../../assets/home/carousel/6.jpg"),
			description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,sunt in culpa qui officia deserunt mollit anim id est laborum.",
			likeStatus: false,
		},
	];
	const currentBook = data.find((book) => book.id === parseInt(id ?? ""));
	const [liked, setLiked] = useState(currentBook?.likeStatus ?? false);
	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ paddingBottom: 20 }}
		>
			<Animated.Image
				source={currentBook?.image}
				sharedTransitionTag={`image-${id}`}
				style={styles.image}
			/>
			<View
				style={{
					flexDirection: "row",
					width: "100%",
					justifyContent: "space-between",
				}}
			>
				<View>
					<Text style={styles.HeadingText}>{currentBook?.title}</Text>
					<Text style={styles.subHeadingText}>{currentBook?.subtitle}</Text>
				</View>
				<Pressable
					style={styles.heartContainer}
					onPress={() => {
						setLiked(!liked);
						if (toastRef.current) {
							toastRef.current.show({
								type: "success",
								text: liked
									? "Removed from favorites"
									: "Added to favorites",
								duration: 2000,
							});
						}
					}}
				>
					<FontAwesome
						name={liked ? "star" : "star-o"}
						size={24}
						color={liked ? "gold" : "black"}
					/>
				</Pressable>
			</View>
			<Text style={styles.descriptionText}>
				{currentBook?.description}
			</Text>
			<Toast ref={toastRef} />
		</ScrollView>
	);
};

export default Details;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fcfffd",
	},
	image: {
		height: 300,
		width: "100%",
	},
	HeadingText: {
		fontSize: 26,
		fontWeight: "bold",
		marginHorizontal: 10,
		marginTop: 10,
	},
	subHeadingText: {
		fontSize: 20,
		fontWeight: "bold",
		marginHorizontal: 10,
		color: "gray",
	},
	descriptionText: {
		fontSize: 18,
		margin: 10,
		color: "#7d7d7d",
	},
	heartContainer: {
		backgroundColor: "#fcfffd",
		padding: 10,
		borderRadius: 50,
		margin: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		height: 50,
		width: 50,
		justifyContent: "center",
		alignItems: "center",
	},
});
