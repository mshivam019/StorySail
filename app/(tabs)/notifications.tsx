import { useEffect, useRef, useCallback } from "react";
import { Text, View, Platform, StyleSheet, FlatList } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useAuth } from "../../provider/AuthProvider";
import { supabase } from "../../lib/supabase";
import { useUserStore, useNotificationStore } from "../../store";
import { Switch } from "../../components";
import { ToastRef, Toast } from "../../components";
import { useFocusEffect } from "expo-router";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

export default function PushNotifications() {
	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();
	const { showNotification, setShowNotification } = useUserStore();
	const { session, handleNotificationPermission } = useAuth();
	const {
		notifications,
		lastfetch,
		setLastFetch,
		getNotifications,
		addNotification,
	} = useNotificationStore();

	const toastref = useRef<ToastRef>(null);
	if (!session) {
		return <Text>No user on the session!</Text>;
	}

	useEffect(() => {
		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				addNotification({
					id: notification.request.identifier,
					title: notification.request.content.title ?? "",
					body: notification.request.content.body ?? "",
				});
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener(
				(response) => {
					addNotification({
						id: response.notification.request.identifier,
						title:
							response.notification.request.content.title ?? "",
						body: response.notification.request.content.body ?? "",
					});
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

	const fetchNotifications = async () => {
		if (showNotification) {
			//check if lastfetch was more than 5 minutes ago
			const now = new Date();
			const diff = now.getTime() - new Date(lastfetch).getTime();
			if (diff > 300000) {
				//fetch notifications
				getNotifications();
				setLastFetch(now);
			}
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchNotifications();
		}, [])
	);

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
					<FlatList
						data={notifications}
						renderItem={({ item }) => (
							<View style={styles.notificationContainer}>
								<Text style={styles.notificationTitle}>
									{item.title}
								</Text>
								<Text style={styles.notificationBody}>
									{item.body}
								</Text>
							</View>
						)}
						keyExtractor={(item) => item.id}
						showsVerticalScrollIndicator={false}
						style={{ width: "100%", gap: 10, paddingTop: 10 }}
					/>
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
		backgroundColor: "#fff",
	},
	emptyContainer: {
		marginTop: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "60%",
	},
	notificationContainer: {
		justifyContent: "center",
		backgroundColor: "#f5f5f5",
		padding: 20,
		margin: 10,
		borderRadius: 10,
		elevation: 5,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	notificationTitle: {
		fontSize: 16,
		fontWeight: "bold",
	},
	notificationBody: {
		fontSize: 14,
	},
});
