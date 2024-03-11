import React, {
	useState,
	useEffect,
	createContext,
	PropsWithChildren,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useUserStore } from "../store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

type AuthProps = {
	user: User | null;
	session: Session | null;
	initialized?: boolean;
	signOut: () => Promise<void>;
	handleNotificationPermission: () => Promise<void>;
};

export const AuthContext = createContext<Partial<AuthProps>>({});

// Custom hook to read the context values
export function useAuth() {
	return React.useContext(AuthContext);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useState<User | null>();
	const [initialized, setInitialized] = useState<boolean>(false);
	const [session, setSession] = useState<Session | null>(null);
	const {
		setUserDetails,
		setShowNotification,
		setIsFirstLogin,
		showNotification,
	} = useUserStore();

	async function getProfile(userId: string) {
		try {
			if (!userId) return;
			const { data, error, status } = await supabase
				.from("profiles")
				.select(`username, website, avatar_url, full_name`)
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
			setUser(session ? session.user : null);
			if (session && session.user) await getProfile(session.user.id);
			setInitialized(true);
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
		setUser(null);
		setUserDetails({
			username: "",
			website: "",
			avatar_url: "",
			full_name: "",
		});
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
						const token = await Notifications.getExpoPushTokenAsync(
							{
								projectId:
									Constants?.expoConfig?.extra?.eas.projectId,
							}
						);
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
		initialized,
		signOut,
		handleNotificationPermission,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
