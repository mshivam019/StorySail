import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { useWritingsStore } from "../../store";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const DraftsCard = ({ title }: { title: string }) => {
	return (
		<Pressable
			style={styles.cardContainer}
			onPress={() =>
				router.push({
					pathname: "/create/editor",
					params: { title: title },
				})
			}
		>
			<Text>{title}</Text>
			<Ionicons name="create-outline" size={24} color="black" />
		</Pressable>
	);
};

const PublishedCard = ({ title }: { title: string }) => {
	return (
		<Pressable
			style={styles.cardContainer}
			onPress={() =>
				router.push({
					pathname: `/home/The art of war`,
				})
			}
		>
			<Text>{title}</Text>
			<Ionicons name="book-outline" size={24} color="black" />
		</Pressable>
	);
};

const MyWorks = () => {
	const { articles } = useWritingsStore();
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Drafts</Text>
			<FlatList
				data={articles}
				renderItem={({ item }) => <DraftsCard title={item.title} />}
				keyExtractor={(item) => item.title}
				showsVerticalScrollIndicator={false}
			/>
			<Text style={styles.title}>Published</Text>
			<FlatList
				data={articles}
				renderItem={({ item }) => <PublishedCard title={item.title} />}
				keyExtractor={(item) => item.title}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
};

export default MyWorks;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		gap: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	cardContainer: {
		padding: 20,
		backgroundColor: "#f5f5f5",
		borderRadius: 10,
		marginBottom: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		elevation: 5,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		alignItems: "center",
		margin: 5,
	},
});
