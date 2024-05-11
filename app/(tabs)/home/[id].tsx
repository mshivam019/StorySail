import React, { useState, useRef, useEffect } from "react";
import {
	StyleSheet,
	Text,
	ScrollView,
	Pressable,
	View,
	ActivityIndicator,
	Share,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import Animated from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import HTMLView from "react-native-htmlview";
import { Toast, ToastRef } from "../../../components";
import { supabase } from "../../../lib/supabase";
import { useUserStore } from "../../../store";
import { useHaptic } from "../../../utils";

interface CurrentBook {
	category: string;
	content: string;
	id: string;
	poster_image_url: string;
	tags: string[];
	title: string;
	user_id: string;
}

function Details() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const toastRef = useRef<ToastRef>(null);
	const [loading, setLoading] = useState(true);
	const { user, userDetails } = useUserStore();
	const [currentBook, setCurrentBook] = useState<CurrentBook | null>(null);

	const haptics = useHaptic() || (() => {});

	const [liked, setLiked] = useState(false);

	const isStarred = async (id: string) => {
		try {
			const { data, error, status } = await supabase
				.from("stars")
				.select("id")
				.eq("user_id", user?.id)
				.eq("writing_id", id)
				.single();
			if (error && status !== 406) {
				console.log("error fetching book");
			}
			if (data) {
				setLiked(true);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getCurrentBook = async (id: string) => {
		try {
			const { data, error, status } = await supabase
				.from("user_writings")
				.select(
					"user_id,category,content,poster_image_url,tags,title,updated_at,id"
				)
				.eq("id", id)
				.single();
			if (error && status !== 406) {
				console.log("error fetching book");
			}
			if (data) {
				setCurrentBook(data);
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const likeHandler = async () => {
		try {
			if (liked) {
				const { error, status } = await supabase
					.from("stars")
					.delete()
					.eq("user_id", user?.id)
					.eq("writing_id", id);
				if (error && status !== 406) {
					console.log("error deleting star");
				}
				setLiked(false);
			} else {
				const { error, status } = await supabase.from("stars").upsert([
					{
						user_id: user?.id,
						writing_id: id,
					},
				]);
				if (error && status !== 406) {
					console.log("error adding star");
				}
				setLiked(true);
				await supabase
					.from("notifications")
					.insert([
						{
							user_id: currentBook?.user_id,
							title: "New Like",
							body: userDetails?.username
								? `${userDetails?.username} liked your article ${currentBook?.title}`
								: `Someone liked your article ${currentBook?.title}`,
						},
					]);
			}
			haptics();
			toastRef.current?.show({
				type: "success",
				text: liked ? "Removed from favorites" : "Added to favorites",
				duration: 2000,
			});
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getCurrentBook(id ?? "");
		isStarred(id ?? "");
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
			contentContainerStyle={{ paddingBottom: 20, flex: 1 }}
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
				<View
					style={{
						flexDirection: "column",
						width: "80%",
					}}
				>
					<Text style={styles.HeadingText}>{currentBook?.title}</Text>
					<Text style={styles.subHeadingText}>
						{currentBook?.category}
					</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						top: -25,
						left: -40,
						gap: 10,
						marginRight: 10,
					}}
				>
					<Pressable
						style={styles.heartContainer}
						onPress={() => {
							likeHandler();
						}}
					>
						<FontAwesome
							name={liked ? "star" : "star-o"}
							size={24}
							color={liked ? "gold" : "black"}
						/>
					</Pressable>
					<Pressable
						style={styles.heartContainer}
						onPress={() => {
							Share.share({
								message: `storysail://home/${currentBook?.id}`,
							});
						}}
					>
						<FontAwesome name="share" size={24} color="black" />
					</Pressable>
				</View>
			</View>
			<HTMLView
				value={currentBook?.content}
				stylesheet={styles}
				style={{
					marginHorizontal: 10,
					marginTop: 10,
				}}
			/>
			<Text
				style={{
					margin: 10,
					color: "gray",
				}}
			>
				{`Tags: ${ 
					currentBook?.tags.map((tag) => `#${tag}`).join(", ")}`}
			</Text>
			<Toast ref={toastRef} />
		</ScrollView>
	);
}

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
		color: "#000000",
	},
	div: {
		fontSize: 18,
		color: "#000000",
	},
	heartContainer: {
		backgroundColor: "#fcfffd",
		padding: 10,
		borderRadius: 50,
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
