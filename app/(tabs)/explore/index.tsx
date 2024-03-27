import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { CustomSearchBar, Suggestions,Search } from "../../../components";

const explore = () => {
	const [searchValue, setSearchValue] = useState("");

	return (
		<View style={styles.container}>
			<CustomSearchBar
				placeholder="Explore!"
				onChangeText={setSearchValue}
				value={searchValue}
			/>
			{searchValue.length > 0 ? (
				<Search	value={searchValue}/>
			) : (
				<Suggestions onPress={setSearchValue}/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fcfffd",
		paddingHorizontal: 20,
		paddingTop: 20,
	},
});

export default explore;
