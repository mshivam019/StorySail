import { StyleSheet, ScrollView, View } from "react-native";
import React from "react";
import MiniCardItem from "./MiniCardItem";

const MiniCards = () => {
	//multiple columns of mini cards
	const rows = 2;
	const columns = 3;
	return (
		<ScrollView
			style={styles.container}
			horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 10, paddingBottom:30 }}
		>
			{[...Array(rows)].map((_, i) => (
				<View key={i}>
					{[...Array(columns)].map((_, j) => (
						<MiniCardItem key={j} row={i} column={j} />
					))}
				</View>
			))}
		</ScrollView>
	);
};

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
});
