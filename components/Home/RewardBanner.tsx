import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { useUserStore } from "../../store";

const RewardBanner = ({
	setShowModal,
	setCoins,
}: {
	setShowModal: (state: boolean) => void;
	setCoins: (state: number) => void;
}) => {
	const { addCoins, getLastRewardDate, setLastRewardDate } = useUserStore();

	const today = new Date().toISOString().split("T")[0];
	const lastCheckin = new Date(getLastRewardDate())
		.toISOString()
		.split("T")[0];

	const rewardHandler = async () => {
		setShowModal(true);
		const randomCoins = Math.floor(Math.random() * 50);
		setCoins(randomCoins);
		const error = await addCoins(randomCoins);
		if (error) {
			console.log("Error adding coins", error);
		} else {
			const dateError = await setLastRewardDate();
			if (dateError) {
				console.log("Error setting last reward date", dateError);
			} else {
				console.log("Coins added successfully");
			}
		}
	};
	return (
		<View style={styles.rewardsContainer}>
			{today !== lastCheckin ? (
				<Pressable
					style={styles.rewardTextContainer}
					onPress={() => {
						rewardHandler();
					}}
				>
					<FontAwesome6 name="coins" size={24} color="#ffd007" />
					<Text style={styles.textStyles}>
						Tap here to collect your reward!
					</Text>
					<FontAwesome6 name="arrow-right" size={24} color="black" />
				</Pressable>
			) : (
				<View style={styles.rewardTextContainer}>
					<Text style={styles.textStyles}>
						Come Back tomorrow for more rewards!
					</Text>
					<FontAwesome6 name="coins" size={24} color="#ffd007" />
				</View>
			)}
		</View>
	);
};

export default RewardBanner;

const styles = StyleSheet.create({
	textStyles: {
		fontSize: 16,
	},
	rewardsContainer: {
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		marginVertical: 20,
		padding: 10,
		borderRadius: 10,
		textAlign: "center",
		backgroundColor: "#fff",
		elevation: 5,
		shadowColor: "#000",
		flexDirection: "row",
	},
	rewardTextContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		gap: 30,
		width: "100%",
	},
});
