import React, { useState, useRef } from "react";
import { ScrollView, StyleSheet, Text, Pressable, View } from "react-native";
import Cards from "../../../components/Home/Cards";
import { useUserStore } from "../../../store";
import { ScratchCard } from "rn-scratch-card";
import LottieView from "lottie-react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Toast, PopupModal, ToastRef } from "../../../components";

const Home = () => {
	const [showModal, setShowModal] = useState(false);
	const { addCoins, getLastRewardDate, setLastRewardDate } = useUserStore();
	const [coins, setCoins] = useState(0);
	const today = new Date().toISOString().split("T")[0];
	const lastCheckin = new Date(getLastRewardDate())
		.toISOString()
		.split("T")[0];
	const toastRef = useRef<ToastRef>(null);

	const rewardHandler = async () => {
		setShowModal(true);
		const randomCoins = Math.floor(Math.random() * 50);
		setCoins(randomCoins);
		const error = await addCoins(randomCoins);
		if (error) {
			if (toastRef.current) {
				toastRef.current.show({
					type: "error",
					text: "Error adding coins! Please try again later.",
					duration: 2000,
				});
			}
		} else {
			const dateError = await setLastRewardDate();
			if (dateError) {
				if (toastRef.current) {
					toastRef.current.show({
						type: "error",
						text: "Error adding coins! Please try again later.",
						duration: 2000,
					});
				}
			} else {
				setTimeout(() => {
					if (toastRef.current) {
						toastRef.current.show({
							type: "success",
							text: `You've earned ${randomCoins} coins!`,
							duration: 2000,
						});
					}
				}, 2000);
			}
		}
	};

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ paddingHorizontal: 20 }}
		>
			<Cards />
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
						brushWidth={150}
						source={require("../../../assets/home/scratch_foreground.png")}
						style={styles.scratchCard}
					/>
				</View>
			</PopupModal>
			<Toast ref={toastRef} />
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
