import React, {
	useState,
	useEffect,
	createContext,
	PropsWithChildren,
	useRef,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useUserStore, useWritingsStore } from "../store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type AuthProps = {
	user: User | null;
	session: Session | null;
	signOut: () => Promise<void>;
	bottomSheetRef: React.RefObject<BottomSheetModal>;
	handlePresentModalPress: () => void;
	handleNotificationPermission: () => Promise<void>;
};

export const AuthContext = createContext<Partial<AuthProps>>({});

// Custom hook to read the context values
export function useAuth() {
	return React.useContext(AuthContext);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [session, setSession] = useState<Session | null>(null);
	const {
		setUserDetails,
		setShowNotification,
		isFirstLogin,
		user,
		setUser,
		setIsFirstLogin,
		setLastRewardDate,
	} = useUserStore();
	const { getArticlesByUser } = useWritingsStore();
	const router = useRouter();

	const bottomSheetRef = useRef<BottomSheetModal>(null);

	const handlePresentModalPress = () => bottomSheetRef.current?.present();

	async function getProfile(userId: string) {
		try {
			if (!userId) return;
			getArticlesByUser();
			const { data, error, status } = await supabase
				.from("profiles")
				.select(
					`username, website, avatar_url, full_name, coins, lastRewardDate`
				)
				.eq("id", userId)
				.single();
			if (error && status !== 406) {
				setSession(null);
			}
			if (data) {
				setUserDetails(data);
			}
		} catch (error) {
			console.error("Error getting profile:", error);
		}
	}

	useEffect(() => {
		// Listen for changes to authentication state
		const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
			setSession(session);
			if (session && session.user) {
				if (session.user.id !== user?.id) {
					setUser(session ? session.user : null);
					await getProfile(session.user.id);
				}
				if (isFirstLogin) {
					router.replace("/onboarding");
				} else router.replace("/(tabs)/home");
			} else {
				setUser(null);
				router.replace("/login");
			}
		});
		return () => {
			data.subscription.unsubscribe();
		};
	}, []);

	// Log out the user
	const signOut = async () => {
		if (!session) return;
		await supabase.auth.signOut().then(() => {
			GoogleSignin.signOut();
		});
		setSession(null);
		setIsFirstLogin(false);
		setUser(null);
		setUserDetails({
			coins: 0,
			username: "username",
			website: "",
			avatar_url: "https://www.gravatar.com/avatar/?d=identicon",
			full_name: "Your name here!",
			lastRewardDate: new Date("2021-01-01T00:00:00Z"),
		});
		setLastRewardDate(new Date ("2021-01-01T00:00:00Z"));
	};

	const handleNotificationPermission = async () => {
		try {
			const { status } = await Notifications.getPermissionsAsync();
			if (status !== "granted") {
				const { status } =
					await Notifications.requestPermissionsAsync();
				if (status !== "granted") {
					setShowNotification(false);
					const { error } = await supabase.from("profiles").upsert({
						id: session?.user.id,
						expo_push_token: null,
					});
					if (error) {
						console.log(error);
					}
				} else {
					const token = await Notifications.getExpoPushTokenAsync({
						projectId: Constants?.expoConfig?.extra?.eas.projectId,
					});
					if (token && session) {
						if (token.data) {
							const { error } = await supabase
								.from("profiles")
								.upsert({
									id: session?.user.id,
									expo_push_token: token,
								});
							console.log(error);
						}
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const value = {
		user,
		session,
		signOut,
		handleNotificationPermission,
		bottomSheetRef,
		handlePresentModalPress,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
