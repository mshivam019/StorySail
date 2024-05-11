import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScratchCard } from "rn-scratch-card";
import LottieView from "lottie-react-native";

function RewardCard({ coins }: { coins: number }) {
	return (
		<View style={styles.card}>
			<View style={styles.backgroundView}>
				<LottieView
					source={require("../../assets/home/coins.json")}
					autoPlay
					loop
					style={{ width: 300, height: 200,alignSelf:"center" }}
				/>
				<Text style={styles.modalText}>
					You have earned {coins} coins
				</Text>
			</View>
			<ScratchCard
				brushWidth={150}
				source={require("../../assets/home/scratch_foreground.png")}
				style={styles.scratchCard}
			/>
		</View>
	);
}

export default RewardCard;

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 16,
	},
	backgroundView: {
		position: "absolute",
		width: 300,
		height: 300,
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
		width: 300,
		height: 300,
		backgroundColor: "transparent",
	},
});
