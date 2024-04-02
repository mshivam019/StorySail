import React, { useState } from "react";
import { ScrollView, StyleSheet,View,ActivityIndicator } from "react-native";
import {
	PopupModal,
	Cards,
	MiniCards,
	RewardCard,
	Categories,
	Recommendations,
} from "../../../components";
import { RewardBanner } from "../../../components";
import { useHomeStore } from "../../../store";
import { useFocusEffect } from "expo-router";

const Home = () => {
	const [showModal, setShowModal] = useState(false);
	const [coins, setCoins] = useState(0);
	const { setRefetchFlag, lastFetch, setLastFetch, refetchFlag } =
		useHomeStore();
	const [loading, setLoading] = useState(true);

	useFocusEffect(() => {
		// last fetch was more than an hour ago set the flag and update the date
		const date = new Date();
		const lastFetchDate = new Date(lastFetch);
		if (date.getTime() - lastFetchDate.getTime() > 3600000) {
			setRefetchFlag(!refetchFlag);
			setLastFetch(date);
		}
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	});

	if(loading){
		return(
			<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
				<ActivityIndicator size="large" color="#000" />
			</View>
		)
	}

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
	},
});

export default Home;
