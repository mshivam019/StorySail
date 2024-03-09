import { Text, View, StyleSheet } from "react-native";

export default function TabOneScreen() {
	return (
		<View style={styles.container}>
			<Text>Tab One</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
