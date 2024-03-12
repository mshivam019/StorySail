import { View, ActivityIndicator } from "react-native";
import React from "react";

const index = () => {
	return (
		<View
			style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
		>
			<ActivityIndicator size="large" color="black" />
		</View>
	);
};

export default index;
