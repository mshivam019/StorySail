import React from "react";
import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { router } from "expo-router";

const Recommendations = () => {
	const data = [
		{
			id: 1,
			title: "The art of war",
			image: require("../../assets/home/carousel/1.jpg"),
		},
		{
			id: 2,
			title: "The Alchemist",
			image: require("../../assets/home/carousel/2.jpg"),
		},
		{
			id: 3,
			title: "The Great Gatsby",
			image: require("../../assets/home/carousel/3.jpg"),
		},
		{
			id: 4,
			title: "The Catcher in the Rye",
			image: require("../../assets/home/carousel/4.jpg"),
		},
		{
			id: 5,
			title: "The Hobbit",
			image: require("../../assets/home/carousel/5.jpg"),
		},
		{
			id: 6,
			title: "The Hitchhiker's Guide to the Galaxy",
			image: require("../../assets/home/carousel/6.jpg"),
		},
	];
	return (
		<View style={styles.container}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					margin: 10,
				}}
			>
				<Text style={styles.headingText}>Trending 🔥</Text>
				<Link href="/explore">
					<Text style={styles.LinkText}>See More</Text>
				</Link>
			</View>
			<FlatList
				data={data}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => {
							router.navigate(`/home/${item.title}`);
						}}
						style={{
							width: 275,
							margin: 10,
						}}
					>
						<View
							style={{
								width: 275,
								height: 200,
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

export default Recommendations;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fcfffd",
		paddingBottom: 20,
	},
	headingText: {
		fontSize: 24,
		fontWeight: "bold",
		margin: 10,
	},
	LinkText: {
		fontSize: 16,
		fontWeight: "500",
		margin: 10,
		color: "blue",
	},
	ImageText: {
		paddingTop: 10,
		fontSize: 18,
		fontWeight: "500",
		textAlign: "center",
	},
});
