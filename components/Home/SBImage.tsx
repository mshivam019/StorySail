import React from "react";
import type { StyleProp, ViewStyle, ImageSourcePropType } from "react-native";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";

interface Props {
	style?: StyleProp<ViewStyle>;
	index?: number;
	showIndex?: boolean;
	img?: ImageSourcePropType;
}

export const SBImageItem: React.FC<Props> = ({ style, index: _index }) => {
	const index = _index ?? 0;
	const source = [
		require("../../assets/home/carousel/1.jpg"),
		require("../../assets/home/carousel/2.jpg"),
		require("../../assets/home/carousel/3.jpg"),
		require("../../assets/home/carousel/4.jpg"),
		require("../../assets/home/carousel/5.jpg"),
		require("../../assets/home/carousel/6.jpg"),
	];
	return (
		<View style={[styles.container, style]}>
			<Image key={index} style={styles.image} source={source[index]} />
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
