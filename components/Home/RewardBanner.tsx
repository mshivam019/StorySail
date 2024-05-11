import {
	StyleSheet,
	Text,
	View,
	Pressable,
	ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { useUserStore } from "../../store";

function RewardBanner({
	setShowModal,
	setCoins,
}: {
	setShowModal: (state: boolean) => void;
	setCoins: (state: number) => void;
}) {
	const { addCoins, getLastRewardDate, setLastRewardDate } = useUserStore();
	const [lastCheckin, setLastCheckin] = useState("");
	const today = new Date().toISOString().split("T")[0];
	const [loading, setLoading] = useState(true);

	const rewardHandler = async () => {
		setShowModal(true);
		const randomCoins = Math.floor(Math.random() * 50);
		setCoins(randomCoins);
		const error = await addCoins(randomCoins);
		if (error) {
			console.log("Error adding coins", error);
		} else {
			const dateError = await setLastRewardDate(new Date());
			if (dateError) {
				console.log("Error setting last reward date", dateError);
			} else {
				console.log("Coins added successfully");
				setLastCheckin(new Date().toISOString().split("T")[0]);
			}
		}
	};

	useEffect(() => {
		const fetchLastCheckin = async () => {
			try {
				const data = await getLastRewardDate();
				setLastCheckin(new Date(data).toISOString().split("T")[0]);
				setLoading(false);
			} catch (e) {
				console.log(e);
			} finally {
				setLoading(false);
			}
		};
		fetchLastCheckin();
	}, [getLastRewardDate]);

	return (
		<View style={styles.rewardsContainer}>
			{loading ? (
				<ActivityIndicator size="large" color="#0000" />
			) : today !== lastCheckin ? (
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
						Come back tomorrow for more rewards!
					</Text>
					<FontAwesome6 name="coins" size={24} color="#ffd007" />
				</View>
			)}
		</View>
	);
}

export default RewardBanner;

const styles = StyleSheet.create({
	textStyles: {
		fontSize: 16,
	},
	rewardsContainer: {
		alignItems: "center",
		justifyContent: "center",
		width: "95%",
		alignSelf: "center",
		marginVertical: 20,
		padding: 10,
		borderRadius: 10,
		textAlign: "center",
		backgroundColor: "#fff",
		elevation: 5,
		shadowColor: "#000",
		flexDirection: "row",
		shadowOffset: {
			width: 0,
			height: 2,
		},
	},
	rewardTextContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		gap: 30,
		width: "100%",
	},
});
