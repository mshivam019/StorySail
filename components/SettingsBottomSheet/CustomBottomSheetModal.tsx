import { View, StyleSheet, Text, Pressable } from "react-native";
import React, { forwardRef, useMemo } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AntDesign, Feather , FontAwesome6 } from "@expo/vector-icons";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import Switch from "../CustomSwitch";
import { useAuth } from "../../provider/AuthProvider";

export type Ref = BottomSheetModal;

const CustomBottomSheetModal = forwardRef<Ref, {}>((props, ref) => {
	const snapPoints = useMemo(() => ["100%"], []);
	const insets = useSafeAreaInsets();
	const { userDetails, setShowNotification, showNotification, getCoins } =
		useUserStore();
	const coins = getCoins();

	const { handleNotificationPermission, signOut } = useAuth();

	const handleDismiss = () => {
		(ref as React.RefObject<BottomSheetModalMethods>).current?.dismiss();
	};
	return (
		<BottomSheetModal
			ref={ref}
			style={{
				paddingTop: insets.top,
			}}
			index={0}
			snapPoints={snapPoints}
			handleStyle={{ alignSelf: "flex-start" }}
			handleComponent={({ animatedIndex }) => (
				<View style={styles.headerStyle}>
					<Text style={styles.containerHeadline}>Settings</Text>
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
					<View
						style={{
							flexDirection: "row",
							position: "absolute",
							right: 30,
							top: 30,
							width: "20%",
						}}
					>
						<FontAwesome6 name="coins" size={24} color="#ffd007" />
						<Text style={styles.headerTextStyle}>{coins}</Text>
					</View>
				</View>
			)}
		>
			<View style={styles.contentContainer}>
				<View style={styles.userContainer}>
					<Image
						source={{ uri: userDetails.avatar_url }}
						style={{
							width: 100,
							height: 100,
							borderRadius: 50,
							marginBottom: 10,
						}}
					/>
					<Text style={{ fontSize: 20, fontWeight: "600" }}>
						{userDetails.full_name}
					</Text>
					<Text style={{ fontSize: 16, color: "grey" }}>
						{userDetails.username}
					</Text>
				</View>
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
					<AntDesign
						name="right"
						size={24}
						color="black"
						style={styles.arrowStyle}
					/>
				</Pressable>
				<Pressable
					onPress={() => {
						router.push("/tc");
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
					<AntDesign name="infocirlceo" size={24} color="black" />
					<Text style={styles.textStyle}>Terms and Conditions</Text>
					<AntDesign
						name="right"
						size={24}
						color="black"
						style={styles.arrowStyle}
					/>
				</Pressable>
				<View style={styles.pressableStyle}>
					<Feather name="bell" size={24} color="black" />
					<Text style={styles.textStyle}>Notifications</Text>
					<View style={{ position: "absolute", right: 20 }}>
						<Switch
							activeColor="#4cd964"
							inActiveColor="#F2F5F7"
							active={showNotification}
							setActive={setShowNotification}
							callBackfn={handleNotificationPermission}
						/>
					</View>
				</View>
				<Pressable
					onPress={() => {
						if (signOut) signOut();
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
					<AntDesign name="logout" size={24} color="black" />
					<Text style={styles.textStyle}>Sign Out</Text>
				</Pressable>
			</View>
		</BottomSheetModal>
	);
});

CustomBottomSheetModal.displayName = "CustomBottomSheetModal";

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: "center",
		paddingTop: 20,
		backgroundColor: "#fff",
	},
	userContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
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
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	textStyle: {
		fontSize: 20,
	},
	headerTextStyle: {
		fontSize: 20,
		marginLeft: 20,
		backgroundColor: "#d9d8d8",
		borderRadius: 10,
		minWidth: 40,
		textAlign: "center",
	},
	pressableStyle: {
		padding: 12,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		gap: 20,
	},
	arrowStyle: {
		position: "absolute",
		right: 20,
	},
});

export default CustomBottomSheetModal;
