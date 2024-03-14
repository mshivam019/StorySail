import React, { useState } from "react";
import { StyleSheet, ScrollView, Text } from "react-native";

import { CustomSearchBar } from "../../../components";

const explore = () => {
	const [searchValue, setSearchValue] = useState("");
	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ paddingHorizontal: 20, marginTop: 20 }}
		>
			<CustomSearchBar
				placeholder="Explore!"
				onChangeText={setSearchValue}
			/>
			<Text>{searchValue}</Text>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fcfffd",
	},
});

export default explore;
