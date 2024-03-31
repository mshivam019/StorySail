import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { useWritingsStore } from "../../store";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useHaptic } from "../../utils";

const MyWorks = () => {
	const haptic = useHaptic();
	const { articles, drafts, deleteDraft, removeArticle } = useWritingsStore();
	if (articles.length === 0 && drafts.length === 0) {
		return (
			<View style={styles.container}>
				<Text>No articles found</Text>
			</View>
		);
	}
	const DraftsCard = ({ title, id }: { title: string; id: string }) => {
		return (
			<View style={styles.cardContainer}>
				<Text numberOfLines={1} style={styles.cardTitle}>
					{title}
				</Text>
				<View style={{ flexDirection: "row", gap: 10 }}>
					<Pressable
						onPress={() => {
							router.push({
								pathname: "/create/editor",
								params: { id: id },
							});
						}}
					>
						<Ionicons
							name="create-outline"
							size={24}
							color="black"
						/>
					</Pressable>
					<Pressable
						onPress={() => {
							deleteDraft(id);
						}}
					>
						<Ionicons
							name="trash-outline"
							size={24}
							color="black"
						/>
					</Pressable>
				</View>
			</View>
		);
	};

	const PublishedCard = ({ title, id }: { title: string; id: string }) => {
		return (
			<View style={styles.cardContainer}>
				<Text numberOfLines={1} style={styles.cardTitle}>
					{title}
				</Text>
				<View style={{ flexDirection: "row", gap: 20 }}>
					<Pressable
						onPress={() =>
							router.push({
								pathname: `/home/${id}`,
							})
						}
					>
						<Ionicons name="book-outline" size={24} color="black" />
					</Pressable>
					<Pressable
						onPress={() => {
							router.push({
								pathname: "/create/editor",
								params: { id: id },
							});
						}}
					>
						<Ionicons
							name="create-outline"
							size={24}
							color="black"
						/>
					</Pressable>
					<Pressable
						onPress={() => {							
							haptic && haptic();
							removeArticle(id);
						}}
					>
						<Ionicons
							name="trash-outline"
							size={24}
							color="black"
						/>
					</Pressable>
				</View>
			</View>
		);
	};
	return (
		<View style={styles.container}>
			{drafts.length > 0 && (
				<View style={styles.draftsContainer}>
					<Text style={styles.title}>Drafts</Text>
					<FlatList
						data={drafts}
						renderItem={({ item }) => (
							<DraftsCard title={item.title} id={item.id} />
						)}
						keyExtractor={(item) => item.title}
						showsVerticalScrollIndicator={false}
					/>
				</View>
			)}
			{articles.length > 0 && (
				<View style={styles.publishedContainer}>
					<Text style={styles.title}>Published</Text>
					<FlatList
						data={articles}
						renderItem={({ item }) => (
							<PublishedCard title={item.title} id={item.id} />
						)}
						keyExtractor={(item) => item.title}
						showsVerticalScrollIndicator={false}
					/>
				</View>
			)}
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
	draftsContainer: {
		backgroundColor: "#e9e6e6",
		flex: 1,
		borderRadius: 10,
		elevation: 5,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
	},
	publishedContainer: {
		backgroundColor: "#eaeaea",
		flex: 1,
		borderRadius: 10,
		elevation: 5,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		padding: 10,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "400",
		width: "50%",
	},
	cardContainer: {
		padding: 20,
		backgroundColor: "#ffffff",
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
