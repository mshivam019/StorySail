import { StyleSheet, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { SIZE } from "./Config";

const styles = StyleSheet.create({
	container: {
		width: SIZE - 20,
		height: 150,
		backgroundColor: "white",
		borderRadius: 30,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.25,
		shadowRadius: 2,
		elevation: 5,
		padding: 14,
		alignSelf: "center",
		marginTop: 10,
	},
});
interface TileProps {
	card: {
		id: string;
		title: string;
		poster_image_url: string;
	};
	id: string;
}

function Tile({ card, id }: TileProps) {
	return (
		<Pressable
			style={styles.container}
			onPress={() => {
				router.navigate(`/home/${id}`);
			}}
		>
			<Image
				style={{
					width: SIZE - 48,
					height: 100,
					borderRadius: 20,
					alignSelf: "center",
				}}
				source={{ uri: card.poster_image_url }}
			/>
			<Text
				style={{
					color: "#000",
					fontWeight: "bold",
					fontSize: 16,
					paddingTop: 10,
					alignSelf: "center",
				}}
				numberOfLines={1}
			>
				{card.title}
			</Text>
		</Pressable>
	);
}

export default Tile;
