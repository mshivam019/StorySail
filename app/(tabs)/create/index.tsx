import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { MyWorks } from "../../../components";
import { EvilIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const Create = () => {
	return (
		<View style={styles.container}>
			<Pressable
				style={styles.LinkContainer}
				onPress={() => router.push("/create/editor")}
			>
				<Text style={styles.text}> Write a new story!</Text>
				<EvilIcons name="pencil" size={32} color="black" />
			</Pressable>
			<MyWorks />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		padding: 20,
	},
	text: {
		fontSize: 20,
		fontWeight: "bold",
	},
	LinkContainer: {
		padding: 20,
		backgroundColor: "#f5f5f5",
		borderRadius: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		elevation: 5,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		marginBottom: 20,
	},
});

export default Create;
