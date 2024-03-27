import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { SIZE } from "./Config";

const styles = StyleSheet.create({
	container: {
		width: SIZE - 20,
		height: 150,
		backgroundColor: "white",
		borderRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.25,
		shadowRadius: 2,
		elevation: 5,
		padding: 14,
		alignSelf: "center",
	},
});
interface TileProps {
	card: {
    id: string;
    title: string;
    image: string;
  }
  id: string;
	onLongPress: () => void;
}

const Tile = ({ card,id }: TileProps) => {

	return (
		<View style={styles.container} pointerEvents="none">
			<Image
        style={{
          width: SIZE - 48,
          height: 100,
          borderRadius: 20,
          alignSelf: "center",
        }}
        source={{ uri: card.image }}
      />
			<Text
				style={{
					color: "#000",
					fontWeight: "bold",
					fontSize: 16,
					paddingTop: 10,
				}}
        numberOfLines={1}
			>
				{card.title}
			</Text>
		</View>
	);
};

export default Tile;
