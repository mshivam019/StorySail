import { StyleSheet, FlatList, View, Text, ScrollView } from "react-native";
import React from "react";
import MiniCardItem from "./MiniCardItem";
import { useHomeStore } from "../../store";

function MiniCards() {
	const { data } = useHomeStore();

	if (!data) return null;

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>Featured</Text>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				directionalLockEnabled
				alwaysBounceVertical={false}
			>
				<FlatList
					data={data.featured_posts.featuredPosts}
					contentContainerStyle={{ alignSelf: "flex-start" }}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					renderItem={({ item }) => <MiniCardItem item={item} />}
					keyExtractor={(item) => item.id.toString()}
					numColumns={
						data.featured_posts.featuredPosts.length > 5 ? 3 : 2
					}
				/>
			</ScrollView>
		</View>
	);
}

export default MiniCards;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headingText: {
		fontSize: 24,
		fontWeight: "bold",
		margin: 10,
		position: "absolute",
		top: 0,
	},
	headerText: {
		fontSize: 24,
		fontWeight: "bold",
		margin: 10,
	},
});
