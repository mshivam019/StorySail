import React from "react";
import type { StyleProp, ViewStyle, ImageSourcePropType } from "react-native";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { CarouselImage } from "../../store/HomeStore";

interface Props {
	style?: StyleProp<ViewStyle>;
	index?: number;
	item: CarouselImage;
}

const SBImageItem: React.FC<Props> = ({
	style,
	index: _index,
	item,
}) => {
	const index = _index ?? 0;

	return (
		<View style={[styles.container, style]}>
			<Image key={index} style={styles.image} source={item.imageUrl} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "transparent",
		borderRadius: 8,
		overflow: "hidden",
	},
	image: {
		width: "100%",
		aspectRatio: 4 / 3,
		borderRadius: 8,
	},
});

export default SBImageItem;
