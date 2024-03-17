import React, { useState,useRef } from "react";
import { StyleSheet, Text, ScrollView, Pressable, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Animated from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import { Toast,ToastRef } from "../../../components";

const Details = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const toastRef = useRef<ToastRef>(null);
	const imagePaths: { [key: string]: any } = {
		"1": require("../../../assets/home/carousel/1.jpg"),
		"2": require("../../../assets/home/carousel/2.jpg"),
		"3": require("../../../assets/home/carousel/3.jpg"),
		"4": require("../../../assets/home/carousel/4.jpg"),
		"5": require("../../../assets/home/carousel/5.jpg"),
		"6": require("../../../assets/home/carousel/6.jpg"),
	};
	const source =
		id && imagePaths[id]
			? imagePaths[id]
			: require("../../../assets/home/carousel/1.jpg");
	const [liked, setLiked] = useState(false);
	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ paddingBottom: 20 }}
		>
			<Animated.Image
				source={source}
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
					<Text style={styles.HeadingText}>Journal Entry {id}</Text>
					<Text style={styles.subHeadingText}>Shivam Mishra</Text>
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
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
				eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
				enim ad minim veniam, quis nostrud exercitation ullamco laboris
				nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
				in reprehenderit in voluptate velit esse cillum dolore eu fugiat
				nulla pariatur. Excepteur sint occaecat cupidatat non proident,
				sunt in culpa qui officia deserunt mollit anim id est laborum.
				{"\n\n"}
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
				eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
				enim ad minim veniam, quis nostrud exercitation ullamco laboris
				nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
				in reprehenderit in voluptate velit esse cillum dolore eu fugiat
				nulla pariatur. Excepteur sint occaecat cupidatat non proident,
				sunt in culpa qui officia deserunt mollit anim id est laborum.
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
