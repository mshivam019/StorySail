import React from "react";
import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import { Image } from "expo-image";
import { Link , router } from "expo-router";
import { useHomeStore } from "../../store";

function Recommendations() {
	const { data } = useHomeStore();
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
			{data  && <FlatList
				data={data.trending_posts.trendingPosts}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => {
							router.navigate(`/home/${item.id}`);
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
								source={item.posterImageUrl}
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
				keyExtractor={(item) => item.id.toString()}
			/>}
		</View>
	);
}

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
