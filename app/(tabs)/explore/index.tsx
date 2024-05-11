import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { CustomSearchBar, Suggestions, Search } from "../../../components";

function Explore() {
	const [searchValue, setSearchValue] = useState("");

	return (
		<LinearGradient
			colors={["#def6fae3", "#ffffff"]}
			style={styles.container}
		>
			<CustomSearchBar
				placeholder="Explore!"
				onChangeText={setSearchValue}
				value={searchValue}
				cancelButton={false}
			/>

			{searchValue.length > 0 && <Search value={searchValue} />}
			{searchValue.length === 0 && (
				<ScrollView
					showsVerticalScrollIndicator={false}
					overScrollMode="never"
				>
					<Suggestions onPress={setSearchValue} />
				</ScrollView>
			)}
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fcfffd",
		padding: 20,
	},
});

export default Explore;
