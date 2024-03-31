import React, { useState, useRef, useEffect } from "react";
import {
	StyleSheet,
	Text,
	ScrollView,
	Pressable,
	View,
	ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import Animated from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import { Toast, ToastRef } from "../../../components";
import { supabase } from "../../../lib/supabase";
import HTMLView from "react-native-htmlview";

interface CurrentBook {
	category: string;
	content: string;
	created_at: string;
	id: string;
	poster_image_url: string;
	stars_count: number;
	tags: string[];
	title: string;
	updated_at: string;
	user_id: string;
}

const Details = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const toastRef = useRef<ToastRef>(null);
	const [loading, setLoading] = useState(true);
	const [currentBook, setCurrentBook] = useState<CurrentBook | null>(null);

	const [liked, setLiked] = useState(false);

	const getCurrentBook = async (id: string) => {
		try {
			const { data, error, status } = await supabase
				.from("user_writings")
				.select("*")
				.eq("id", id)
				.single();
			if (error && status !== 406) {
				console.log("error fetching book");
			}
			if (data) {
				setCurrentBook(data);
				console.log(data);
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getCurrentBook(id ?? "");
	}, [id]);

	if (loading)
		return (
			<ActivityIndicator
				size="large"
				color="#000"
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			/>
		);
	if (!currentBook) return <Text>No book found</Text>;
	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ paddingBottom: 20 }}
		>
			<Stack.Screen options={{ title: currentBook.title }} />
			<Animated.Image
				source={{ uri: currentBook?.poster_image_url }}
				sharedTransitionTag={`image-${currentBook?.id}`}
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
					<Text style={styles.subHeadingText}>
						{currentBook?.category}
					</Text>
				</View>
				<Pressable
					style={styles.heartContainer}
					onPress={() => {
						setLiked(!liked);
						toastRef.current?.show({
							type: "success",
							text: liked
								? "Removed from favorites"
								: "Added to favorites",
							duration: 2000,
						});
					}}
				>
					<FontAwesome
						name={liked ? "star" : "star-o"}
						size={24}
						color={liked ? "gold" : "black"}
					/>
				</Pressable>
			</View>
			<HTMLView
				value={currentBook?.content}
				stylesheet={styles}
				style={{
					marginHorizontal: 10,
					marginTop: 10,
				}}
			/>

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
	p: {
		fontSize: 18,
		color: "#7d7d7d",
	},
	div: {
		fontSize: 18,
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
