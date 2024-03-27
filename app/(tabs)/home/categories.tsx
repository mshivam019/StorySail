import { StyleSheet, FlatList, View } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { MiniCardItem } from "../../../components";

const categories = () => {
	const { category } = useLocalSearchParams<{ category: string }>();
	const data = [
		{
			title: "Fantasy",
			image: require("../../../assets/home/carousel/1.jpg"),
		},
		{
			title: "Adventure",
			image: require("../../../assets/home/carousel/2.jpg"),
		},
		{
			title: "Romance",
			image: require("../../../assets/home/carousel/3.jpg"),
		},
		{
			title: "Mystery",
			image: require("../../../assets/home/carousel/4.jpg"),
		},
		{
			title: "Horror",
			image: require("../../../assets/home/carousel/5.jpg"),
		},
		{
			title: "Science Fiction",
			image: require("../../../assets/home/carousel/6.jpg"),
		},
	];
	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: category,
				}}
			/>
			<FlatList
				style={{ padding: 10 }}
				contentContainerStyle={{ paddingBottom: 30,justifyContent: "center"}}
				data={data}
				renderItem={({ item, index }) => <MiniCardItem id={index+1} widthPercent={0.9}/>}
				keyExtractor={(item) => item.title}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
};

export default categories;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
