import { Text, StyleSheet, Pressable } from "react-native";
import React from "react";

import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { EvilIcons } from "@expo/vector-icons";
import { MyWorks } from "../../../components";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		padding: 20,
	},
	text: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
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

function Create() {
	return (
		<LinearGradient
			colors={["#cef7fde4", "#ffffff"]}
			style={{ flex: 1, padding: 20 }}
		>
			<Pressable onPress={() => router.push("/create/editor")}>
				<LinearGradient
					colors={["#7ecfef", "#9ecaff"]}
					style={styles.LinkContainer}
				>
					<Text style={styles.text}> Write a new story!</Text>
					<EvilIcons name="pencil" size={32} color="white" />
				</LinearGradient>
			</Pressable>
			<MyWorks />
		</LinearGradient>
	);
}

export default Create;
