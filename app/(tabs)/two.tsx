import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Account from "../../components/Account";
import { useApp } from "../../context/AppContext";

export default function TabTwoScreen() {
	const session = useApp()?.session || null;
	return (
		<SafeAreaView style={styles.container}>
			<Account session={session} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
