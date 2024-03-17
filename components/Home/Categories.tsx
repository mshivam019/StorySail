import React from "react";
import { StyleSheet, View, FlatList, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";

const Categories = () => {
	const data = [
		{
			title: "Fantasy",
			image: require("../../assets/home/carousel/1.jpg"),
		},
		{
			title: "Adventure",
			image: require("../../assets/home/carousel/2.jpg"),
		},
		{
			title: "Romance",
			image: require("../../assets/home/carousel/3.jpg"),
		},
		{
			title: "Mystery",
			image: require("../../assets/home/carousel/4.jpg"),
		},
		{ title: "Horror", image: require("../../assets/home/carousel/5.jpg") },
		{
			title: "Science Fiction",
			image: require("../../assets/home/carousel/6.jpg"),
		},
	];

	return (
		<View style={styles.container}>
			<Text style={styles.headingText}>Categories</Text>
			<FlatList
				data={data}
				renderItem={({ item }) => (
					<Pressable
						onPress={() =>
							router.push({
								pathname: "/home/categories",
								params: { category: item.title },
							})
						}
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
				horizontal
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.title}
			/>
		</View>
	);
};

export default Categories;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingBottom: 20,
	},
	headingText: {
		fontSize: 24,
		fontWeight: "bold",
		margin: 10,
	},
	ImageText: {
		fontSize: 18,
		fontWeight: "600",
		textAlign: "center",
	},
});
