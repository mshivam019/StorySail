import { StyleSheet, View } from "react-native";
import Account from "../../components/Account";
import { useApp } from "../../context/AppContext";

export default function TabTwoScreen() {
	const session = useApp()?.session || null;
	return (
		<View style={styles.container}>
			<Account session={session} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
