import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const categories = () => {
	const { category } = useLocalSearchParams();
	return (
		<View>
			<Text>{category}</Text>
		</View>
	);
};

export default categories;

const styles = StyleSheet.create({});
