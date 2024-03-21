import { useState, useEffect, useRef } from "react";
import { Text, View, Platform, StyleSheet, FlatList } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useAuth } from "../../provider/AuthProvider";
import { supabase } from "../../lib/supabase";
import { useUserStore } from "../../store";
import { Switch } from "../../components";
import { ToastRef, Toast } from "../../components";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

export default function PushNotifications() {
	const { showNotification, setShowNotification } = useUserStore();
	const [expoPushToken, setExpoPushToken] = useState("");
	const [notifications, setNotifications] = useState([]);
	const { session, handleNotificationPermission } = useAuth();

	const toastref = useRef<ToastRef>(null);
	if (!session) {
		return <Text>No user on the session!</Text>;
	}

	async function registerForPushNotificationsAsync() {
		let token;

		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}

		if (Device.isDevice) {
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			if (existingStatus !== "granted") {
				const { status } =
					await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				toastref.current?.show({
					type: "error",
					text: "Failed to get push token for push notification!",
					duration: 3000,
				});
				setShowNotification(false);
				return "";
			}
			token = await Notifications.getExpoPushTokenAsync({
				projectId: Constants?.expoConfig?.extra?.eas.projectId,
			});
			setShowNotification(true);
		} else {
			toastref.current?.show({
				type: "error",
				text: "Failed to get push token for push notification!",
				duration: 3000,
			});
		}

		return token?.data ?? "";
	}

	useEffect(() => {
		registerForPushNotificationsAsync().then(async (token) => {
			setExpoPushToken(token);
			const { error } = await supabase
				.from("profiles")
				.upsert({ id: session?.user.id, expo_push_token: token });
			//console.log(error);
		});
	}, []);

	if (!showNotification) {
		return (
			<View style={styles.container}>
				<Text>Notifications are not enabled!</Text>
				<Text>Enable notifications to receive push notifications</Text>
				<View style={styles.emptyContainer}>
					<Text>Enable Notifications</Text>
					<Switch
						activeColor={"#4cd964"}
						inActiveColor={"#F2F5F7"}
						active={showNotification}
						setActive={setShowNotification}
						callBackfn={handleNotificationPermission}
					/>
				</View>
				<Toast ref={toastref} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={{ alignItems: "center", justifyContent: "center" }}>
				{notifications.length > 0 ? (
					notifications.map((notification) => (
						<FlatList
							data={notification}
							renderItem={({ item }) => (
								<View style={{ flexDirection: "row" }}>
									<Text>{item.title}</Text>
									<Text>{item.body}</Text>
								</View>
							)}
							keyExtractor={(item) => item.id}
							showsVerticalScrollIndicator={false}
						/>
					))
				) : (
					<Text>No notifications yet!</Text>
				)}
			</View>
			<Toast ref={toastref} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	emptyContainer: {
		marginTop: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "60%",
	},
});
