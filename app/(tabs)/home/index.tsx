import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, Pressable, View } from "react-native";
import Cards from "../../../components/Home/Cards";
import { useHomeDataStore, useUserStore } from "../../../store";
import PopupModal from "../../../components/PopupModal";
import { ScratchCard } from "rn-scratch-card";
import LottieView from "lottie-react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const Home = () => {
	const { lastCheckinDate, setLastCheckinDate } = useHomeDataStore();
	const today = new Date().toISOString().split("T")[0];
	const lastCheckin = lastCheckinDate.split("T")[0];
	const [showModal, setShowModal] = useState(false);
	const { addCoins } = useUserStore();
	const [coins, setCoins] = useState(0);

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ paddingHorizontal: 20 }}
		>
			<Cards />
			<View style={styles.rewardsContainer}>
				{today!==lastCheckin ? (
					<Pressable
						style={styles.rewardTextContainer}
						onPress={() => {
							setShowModal(true);
							const randomCoins =
								Math.floor(Math.random() * 50) + 50;
							setCoins(randomCoins);
							addCoins(randomCoins);
							setLastCheckinDate();
						}}
					>
						<FontAwesome6 name="coins" size={24} color="#ffd007" />
						<Text style={styles.textStyles}>
							Tap here to collect your reward!
						</Text>
						<FontAwesome6
							name="arrow-right"
							size={24}
							color="black"
						/>
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
			<PopupModal
				isVisible={showModal}
				onDismiss={() => setShowModal(false)}
			>
				<View style={styles.card}>
					<View style={styles.backgroundView}>
						<LottieView
							source={require("../../../assets/home/coins.json")}
							autoPlay
							loop={true}
							style={{ width: 200, height: 100 }}
						/>
						<Text style={styles.modalText}>
							You've earned {coins} coins
						</Text>
					</View>
					<ScratchCard
						brushWidth={140}
						source={require("../../../assets/home/scratch_foreground.png")}
						style={styles.scratchCard}
					/>
				</View>
			</PopupModal>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#eef1fe",
	},
	textStyles: {
		fontSize: 16,
	},
	card: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 16,
	},
	backgroundView: {
		position: "absolute",
		width: 200,
		height: 200,
		backgroundColor: "white",
		alignSelf: "center",
		borderRadius: 16,
	},
	modalText: {
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
		margin: 20,
	},
	scratchCard: {
		width: 200,
		height: 200,
		backgroundColor: "transparent",
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

export default Home;
