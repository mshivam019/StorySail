import { useState } from "react";
import { ScrollView, StyleSheet} from "react-native";

import { useFocusEffect } from "expo-router";
import {
	PopupModal,
	Cards,
	MiniCards,
	RewardCard,
	Categories,
	Recommendations,
	RewardBanner,
} from "../../../components";
import { useHomeStore } from "../../../store";

function Home() {
	const [showModal, setShowModal] = useState(false);
	const [coins, setCoins] = useState(0);
	const { setRefetchFlag, lastFetch, setLastFetch, refetchFlag } =
		useHomeStore();

	useFocusEffect(() => {
		// last fetch was more than an hour ago set the flag and update the date
		const date = new Date();
		const lastFetchDate = new Date(lastFetch);
		if (date.getTime() - lastFetchDate.getTime() > 3600000) {
			setRefetchFlag(!refetchFlag);
			setLastFetch(date);
		}
	});

	return (
		<ScrollView style={styles.container}
		overScrollMode="never"
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
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fcfffd",
	},
});

export default Home;
