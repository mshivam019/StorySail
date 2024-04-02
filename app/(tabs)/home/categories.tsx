import {
	StyleSheet,
	FlatList,
	View,
	ActivityIndicator,
	Text,
	Pressable,
	Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";
import Animated from "react-native-reanimated";
const { width } = Dimensions.get("window");

interface CategoryData {
	title: string;
	poster_image_url: string;
	id: string;
}

const categories = () => {
	const { category } = useLocalSearchParams<{ category: string }>();
	const [categoryData, setCategoryData] = useState<CategoryData[] | []>([]);
	const [loading, setLoading] = useState(true);
	const [range, setRange] = useState({ start: 0, end: 10 });
	const [endReached, setEndReached] = useState(false);

	const fetchCategoryData = async (start: number, end: number) => {
		try {
			if (endReached) {
				return;
			}
			const { data, error } = await supabase
				.from("user_writings")
				.select("title,poster_image_url,id")
				.eq("category", category)
				.order("stars_count", { ascending: false })
				.range(start, end);
			if (error) console.log("error", error);
			if (data && data?.length > 0) {
				if (categoryData.length > 0) {
					setCategoryData([...categoryData, ...data]);
				} else {
					setCategoryData(data);
				}
				setLoading(false);
			} else {
				setEndReached(true);
			}
		} catch (error) {
			console.log("error", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategoryData(0, 10);
	}, []);

	if (loading) {
		return <ActivityIndicator size="large" color="#000" />;
	}

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: category,
				}}
			/>
			{categoryData.length > 0 ? (
				<FlatList
					data={categoryData}
					renderItem={({ item }) => {
						return (
							<Pressable style={styles.cardContainer}>
								<Animated.Image
									style={styles.image}
									source={{ uri: item.poster_image_url }}
									sharedTransitionTag={`image-${item.id}`}
								/>
								<View style={styles.contentContainer}>
									<Text
										style={{
											fontSize: 20,
											width: width * 0.5,
										}}
									>
										{item.title}
									</Text>
								</View>
							</Pressable>
						);
					}}
					keyExtractor={(_, index) => index.toString()}
					showsVerticalScrollIndicator={false}
					onEndReachedThreshold={0.5}
					onEndReached={() => {
						fetchCategoryData(range.start + 10, range.end + 10);
						setRange({
							start: range.start + 10,
							end: range.end + 10,
						});
					}}
				/>
			) : (
				<View style={styles.container}>
					<Text
						style={{
							fontSize: 20,
							width: width * 0.5,
						}}
					>
						No content available
					</Text>
				</View>
			)}
		</View>
	);
};

export default categories;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	cardContainer: {
		flex: 1,
		width: width * 0.95,
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
		alignItems: "center",
		justifyContent: "center",
	},
});
