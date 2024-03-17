import React, { useState } from "react";
import { ScrollView, StyleSheet} from "react-native";
import {
	PopupModal,
	Cards,
	MiniCards,
	RewardCard,
	Categories,
	Recommendations,
} from "../../../components";
import { RewardBanner } from "../../../components";

const Home = () => {
	const [showModal, setShowModal] = useState(false);
	const [coins, setCoins] = useState(0);

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ paddingHorizontal: 20 }}
		>
			<Cards />
			<RewardBanner setShowModal={setShowModal} setCoins={setCoins} />
			<MiniCards />
			<Categories />
			<Recommendations />
			<PopupModal
				isVisible={showModal}
				onDismiss={() => setShowModal(false)}
			>
				<RewardCard coins={coins} />
			</PopupModal>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fcfffd",
	}
});

export default Home;
