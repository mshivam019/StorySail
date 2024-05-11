import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { CustomSearchBar, Suggestions,Search } from "../../../components";

function Explore() {
	const [searchValue, setSearchValue] = useState("");

	return (
		<LinearGradient 
		colors={["#def6fae3", "#ffffff"]}
		style={styles.container}>
			<CustomSearchBar
				placeholder="Explore!"
				onChangeText={setSearchValue}
				value={searchValue}
				cancelButton={false}			
			/>
			{searchValue.length > 0 ? (
				<Search	value={searchValue}/>
			) : (
				<Suggestions onPress={setSearchValue}/>
			)}
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fcfffd",
		paddingHorizontal: 20,
		paddingTop: 20,
	},
});

export default Explore;
