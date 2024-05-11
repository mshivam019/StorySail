import React from "react";
import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useHomeStore } from "../../store";

function Suggestions({ onPress }: { onPress: (text: string) => void }) {
	const suggestions = [
		{
			text: "Thriller",
			color: "#fddbc8",
		},
		{
			text: "Comedy",
			color: "#e8f6d5",
		},
		{
			text: "Action",
			color: "#cfd7f1",
		},
		{
			text: "Adventure",
			color: "#f1d4fc",
		},
		{
			text: "Drama",
			color: "#fff8a9",
		},
		{
			text: "Romance",
			color: "#f8e1cf",
		},
		{
			text: "sci-fi",
			color: "#baf2f8",
		},
		{
			text: "animation",
			color: "#ffdfc7",
		},
		{
			text: "Fantasy",
			color: "#bedbed",
		},
	];
	const { data } = useHomeStore();

	if(!data) return null;
	
	return (
		<View style={styles.suggestionsContainer}>
			<View style={styles.suggestionsHeader}>
				<Text style={styles.headerText}>Top Searches</Text>
				<MaterialIcons name="arrow-outward" size={24} color="gray" />
			</View>
			<View style={styles.suggestions}>
				{suggestions.map((suggestion, index) => (
					<Pressable
						key={suggestion.text}
						style={{
							backgroundColor: suggestion.color,
							borderRadius: 5,
							paddingHorizontal: 10,
							paddingVertical: 2,
							opacity: 0.8,
						}}
						onPress={() => {
							onPress(suggestion.text);
						}}
					>
						<Text style={styles.suggestionTextStyle}>
							{suggestion.text}
						</Text>
					</Pressable>
				))}
			</View>
			<Text style={styles.categoriesText}>Categories</Text>
			{
				data.categories.categories.map((item) => (
					<Pressable
						key={item.id}
						onPress={() =>
							router.push({
								pathname: "/home/categories",
								params: { category: item.name },
							})
						}
						style={styles.categoriesContainer}
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
				))
			}
		</View>
	);
}

export default Suggestions;

const styles = StyleSheet.create({
	suggestionsContainer: {
		paddingTop: 20,
		flex: 1,
	},
	suggestionsHeader: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-between",
	},
	headerText: {
		fontSize: 20,
		color: "gray",
	},
	suggestions: {
		paddingTop: 20,
		flexDirection: "row",
		gap: 20,
		width: "100%",
		flexWrap: "wrap",
	},
	suggestionTextStyle: {
		fontSize: 20,
	},
	categoriesText: {
		fontSize: 20,
		textAlign: "left",
		color: "black",
		paddingTop: 30,
		paddingBottom: 10,
		fontWeight: "600",
	},
	ImageText: {
		fontSize: 18,
		fontWeight: "600",
		textAlign: "center",
	},
	categoriesContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		width: "100%",
		gap: 20,
	},
});
