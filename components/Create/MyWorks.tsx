import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";

const MyWorks = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Existing Works</Text>
			<FlatList
				data={["A", "B", "C", "D"]}
				renderItem={({ item }) => <Text>{item}</Text>}
				keyExtractor={(item) => item}
			/>
		</View>
	);
};

export default MyWorks;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
});
