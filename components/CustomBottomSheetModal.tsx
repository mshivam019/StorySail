import { View, StyleSheet, Text, Pressable } from "react-native";
import React, { forwardRef, useMemo } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AntDesign } from "@expo/vector-icons";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { router } from "expo-router";
export type Ref = BottomSheetModal;

const CustomBottomSheetModal = forwardRef<Ref, {}>((props, ref) => {
	const snapPoints = useMemo(() => ["95%"], []);

	const handleDismiss = () => {
		(ref as React.RefObject<BottomSheetModalMethods>).current?.dismiss();
	};
	return (
		<BottomSheetModal
			ref={ref}
			index={0}
			snapPoints={snapPoints}
			handleStyle={{ alignSelf: "flex-start" }}
			handleComponent={({ animatedIndex }) => (
				<View style={styles.headerStyle}>
					<Pressable
						onPress={() => handleDismiss()}
						style={styles.IconStyle}
					>
						<AntDesign name="close" size={25} color="black" />
					</Pressable>
				</View>
			)}
		>
			<View style={styles.contentContainer}>
				<Pressable
					onPress={() => {
						router.push("/profile");
						handleDismiss();
					}}
				>
					<Text style={styles.textStyle}>Profile</Text>
				</Pressable>
				<Pressable
					onPress={() => {
						router.push("/settings");
						handleDismiss();
					}}
				>
					<Text style={styles.textStyle}>Settings</Text>
				</Pressable>
			</View>
		</BottomSheetModal>
	);
});

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: "center",
	},
	containerHeadline: {
		fontSize: 24,
		fontWeight: "600",
		padding: 20,
	},
	IconStyle: {
		position: "absolute",
		left: 20,
		top: 18,
	},
	headerStyle: {
		padding: 16,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	textStyle: {
		fontSize: 20,
	},
});

export default CustomBottomSheetModal;
