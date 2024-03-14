import React from "react";
import type { StyleProp, ViewStyle, ImageSourcePropType } from "react-native";
import { StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";

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
			<Pressable
				style={styles.container}
				onPress={() => router.push({
          pathname: '/home/offers',
          params: { id: `${index + 1}` },
        })}
			>
				<Image
					key={index}
					style={styles.image}
					source={source[index]}
				/>
			</Pressable>
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
