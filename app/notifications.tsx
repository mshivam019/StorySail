import { useEffect, useRef, useCallback } from "react";
import {
	Text,
	View,
	Platform,
	StyleSheet,
	FlatList,
	Animated,
	Pressable,
} from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useFocusEffect } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import { useAuth } from "../provider/AuthProvider";
import { supabase } from "../lib/supabase";
import { useUserStore, useNotificationStore } from "../store";
import { Switch , ToastRef, Toast } from "../components";

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
		deleteNotification,
	} = useNotificationStore();

	const toastref = useRef<ToastRef>(null);

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
			// check if lastfetch was more than 5 minutes ago
			const now = new Date();
			const diff = now.getTime() - new Date(lastfetch).getTime();
			if (diff > 300000) {
				// fetch notifications
				getNotifications();
				setLastFetch(now);
			}
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchNotifications();
		}, [showNotification, lastfetch])
	);

	const renderRightActions = (
		progress: Animated.AnimatedInterpolation<number>,
		dragX: Animated.AnimatedInterpolation<number>,
		id: string
	) => {
		const opacity = dragX.interpolate({
			inputRange: [-150, 0],
			outputRange: [1, 0],
			extrapolate: "clamp",
		});

		return (
			<View style={styles.swipedRow}>
				<View style={styles.swipedConfirmationContainer}>
					<Text style={styles.deleteConfirmationText}>
						Are you sure?
					</Text>
				</View>
				<Animated.View style={[styles.deleteButton, { opacity }]}>
					<Pressable
						onPress={() => {
							deleteNotification(id);
						}}
					>
						<Text style={styles.deleteButtonText}>Delete</Text>
					</Pressable>
				</Animated.View>
			</View>
		);
	};

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
			console.log("error", error);
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
						activeColor="#4cd964"
						inActiveColor="#F2F5F7"
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
                        contentContainerStyle={{paddingBottom:10}}
						renderItem={({ item }) => (
							<Swipeable
								renderRightActions={(progress, dragX) =>
									renderRightActions(progress, dragX, item.id)
								}
							>
								<View style={styles.notificationContainer}>
									<Text style={styles.notificationTitle}>
										{item.title}
									</Text>
									<Text style={styles.notificationBody}>
										{item.body}
									</Text>
								</View>
							</Swipeable>
						)}
						keyExtractor={(item) => item.id}
						showsVerticalScrollIndicator={false}
						style={{ width: "100%", gap: 10, paddingVertical: 10,paddingHorizontal:10 }}
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
	swipedRow: {
		flexDirection: "row",
		flex: 1,
		alignItems: "center",
		backgroundColor: "#d4d4d4",
		margin: 10,
		minHeight: 50,
		borderRadius: 10,
	},
	swipedConfirmationContainer: {
		flex: 1,
		padding: 10,
	},
	deleteConfirmationText: {
		color: "#000000",
		fontWeight: "bold",
		fontSize: 20,
	},
	deleteButton: {
		backgroundColor: "#ec0e0e",
		flexDirection: "column",
		justifyContent: "center",
		height: "100%",
		padding: 10,
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
	},
	deleteButtonText: {
		color: "#fcfcfc",
		fontWeight: "bold",
		padding: 3,
	},
});
