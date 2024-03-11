import { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform, StyleSheet } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useAuth } from "../../provider/AuthProvider";
import { supabase } from "../../lib/supabase";
import { useUserStore } from "../../store";
import { Switch } from "../../components";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken: string) {
	const message = {
		to: expoPushToken,
		sound: "default",
		title: "Original Title",
		body: "And here is the body!",
		data: { someData: "goes here" },
	};

	await fetch("https://exp.host/--/api/v2/push/send", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Accept-encoding": "gzip, deflate",
			"Content-Type": "application/json",
			Authorization: `Bearer <YOUR EXPO PUSH TOKEN>`,
		},
		body: JSON.stringify(message),
	});
}

export default function PushNotifications() {
	const { showNotification, setShowNotification } = useUserStore();
	const [expoPushToken, setExpoPushToken] = useState("");
	const [notification, setNotification] =
		useState<Notifications.Notification>();
	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();
	const { session, handleNotificationPermission } = useAuth();

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
				alert("Failed to get push token for push notification!");
				setShowNotification(false);
				return "";
			}
			token = await Notifications.getExpoPushTokenAsync({
				projectId: Constants?.expoConfig?.extra?.eas.projectId,
			});
			setShowNotification(true);
		} else {
			alert("Must use physical device for Push Notifications");
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

		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener(
				(response) => {
					console.log(response);
				}
			);

		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current!
			);
			Notifications.removeNotificationSubscription(
				responseListener.current!
			);
		};
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
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text>Your expo push token: {expoPushToken}</Text>
			<View style={{ alignItems: "center", justifyContent: "center" }}>
				<Text>
					Title: {notification && notification.request.content.title}
				</Text>
				<Text>
					Body: {notification && notification.request.content.body}
				</Text>
				<Text>
					Data:{" "}
					{notification &&
						JSON.stringify(notification.request.content.data)}
				</Text>
			</View>
			<Button
				title="Press to Send Notification"
				onPress={async () => {
					await sendPushNotification(expoPushToken);
				}}
			/>
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
