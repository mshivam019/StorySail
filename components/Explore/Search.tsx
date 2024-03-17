import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { router } from "expo-router";

const Search = ({ value }: { value: string }) => {
	const books = [
		{
			id: 1,
			title: "The Alchemist",
			image: require("../../assets/home/carousel/1.jpg"),
			tags: ["adventure", "fantasy", "fiction"],
		},
		{
			id: 2,
			title: "The Da Vinci Code",
			image: require("../../assets/home/carousel/2.jpg"),
			tags: ["mystery", "thriller", "fiction"],
		},
		{
			id: 3,
			title: "The Kite Runner",
			image: require("../../assets/home/carousel/3.jpg"),
			tags: ["drama", "romance", "fiction"],
		},
		{
			id: 4,
			title: "The Great Gatsby",
			image: require("../../assets/home/carousel/4.jpg"),
			tags: ["romance", "drama", "fiction"],
		},
		{
			id: 5,
			title: "The Catcher in the Rye",
			image: require("../../assets/home/carousel/5.jpg"),
			tags: ["drama", "fiction"],
		},
		{
			id: 6,
			title: "To Kill a Mockingbird",
			image: require("../../assets/home/carousel/6.jpg"),
			tags: ["drama", "fiction"],
		},
	];

	return (
		<View style={styles.container}>
			<FlatList
				data={books.filter(
					(book) =>
						book.title.includes(value) || book.tags.includes(value)
				)}
				renderItem={({ item }) => (
					<Pressable
						style={styles.categoriesContainer}
						onPress={() => router.navigate(`/home/${item.id}`)}
					>
						<View
							style={{
								width: 100,
								height: 100,
								margin: 10,
							}}
						>
							<Image
								source={item.image}
								style={{
									width: "100%",
									height: "100%",
									borderRadius: 10,
								}}
							/>
						</View>
						<Text style={styles.ImageText}>{item.title}</Text>
					</Pressable>
				)}
				keyExtractor={(item) => item.title}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
};

export default Search;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fcfffd",
		paddingTop: 20,
		width: "100%",
	},
	categoriesContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		width: "100%",
		borderRadius: 10,
		backgroundColor: "#f2f2f2",
	},
	ImageText: {
		fontSize: 16,
		fontWeight: "500",
		color: "#000",
		flexWrap: "wrap",
		width: "60%",
	},
});
