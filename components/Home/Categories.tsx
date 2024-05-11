import React from "react";
import { StyleSheet, View, FlatList, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useHomeStore } from "../../store";

function Categories() {
	const {data} = useHomeStore();

	return (
		<View style={styles.container}>
			<Text style={styles.headingText}>Categories</Text>
			{data && <FlatList
				data={data.categories.categories}
				renderItem={({ item }) => (
					<Pressable
						onPress={() =>
							router.push({
								pathname: "/home/categories",
								params: { category: item.name },
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
								source={item.imageUrl}
								style={{
									width: "100%",
									height: "100%",
									borderRadius: 10,
								}}
							/>
						</View>
						<Text style={styles.ImageText}>{item.name}</Text>
					</Pressable>
				)}
				horizontal
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.name}
			/>}
		</View>
	);
}

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
