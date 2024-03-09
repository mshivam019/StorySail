import { View, StyleSheet, Text, Pressable } from "react-native";
import React, { forwardRef, useMemo } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AntDesign } from "@expo/vector-icons";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { router } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { supabase } from "../lib/supabase";
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
						style={({ pressed }) => [
							styles.IconStyle,
							{
								backgroundColor: pressed
									? "#dcdcdc"
									: "transparent",
							},
						]}
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
					style={({ pressed }) => [
						styles.pressableStyle,
						{
							backgroundColor: pressed
								? "#dcdcdc"
								: "transparent",
						},
					]}
				>
					<AntDesign name="user" size={24} color="black" />
					<Text style={styles.textStyle}>Edit Profile</Text>
				</Pressable>
				<Pressable
					onPress={() => {
						router.push("/settings");
						handleDismiss();
					}}
					style={({ pressed }) => [
						styles.pressableStyle,
						{
							backgroundColor: pressed
								? "#dcdcdc"
								: "transparent",
						},
					]}
				>
					<AntDesign name="setting" size={24} color="black" />
					<Text style={styles.textStyle}>Settings</Text>
				</Pressable>
				<Pressable
					onPress={() => {
						supabase.auth.signOut().then(() => {
							GoogleSignin.signOut();
							handleDismiss();
						});
					}}
					style={({ pressed }) => [
						styles.pressableStyle,
						{
							backgroundColor: pressed
								? "#dcdcdc"
								: "transparent",
						},
					]}
				>
					<AntDesign name="logout" size={24} color="black" />
					<Text style={styles.textStyle}>Sign Out</Text>
				</Pressable>
			</View>
		</BottomSheetModal>
	);
});

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: "center",
		paddingTop: 20,
	},
	containerHeadline: {
		fontSize: 24,
		fontWeight: "600",
		padding: 20,
	},
	IconStyle: {
		position: "absolute",
		left: 3,
		top: 10,
		padding: 10,
		borderRadius: 50,
	},
	headerStyle: {
		padding: 16,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	textStyle: {
		fontSize: 20,
	},
	pressableStyle: {
		padding: 12,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		gap: 20,
	},
});

export default CustomBottomSheetModal;
