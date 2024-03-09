import React from "react";
import { View } from "react-native";
import { Account } from "../../components";
import { useAuth } from "../../provider/AuthProvider";

const profile = () => {
	const { session = null } = useAuth();

	return (
		<View>
			<Account session={session} />
		</View>
	);
};

export default profile;
