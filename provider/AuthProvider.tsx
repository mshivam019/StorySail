import React, {
	useState,
	useEffect,
	createContext,
	PropsWithChildren,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useUserStore } from "../store";

type AuthProps = {
	user: User | null;
	session: Session | null;
	initialized?: boolean;
	signOut?: () => void;
};

export const AuthContext = createContext<Partial<AuthProps>>({});

// Custom hook to read the context values
export function useAuth() {
	return React.useContext(AuthContext);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useState<User | null>();
	const [session, setSession] = useState<Session | null>(null);
	const [initialized, setInitialized] = useState<boolean>(false);
	const { setUserDetails } = useUserStore();

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
		} finally {
			setInitialized(true);
		}
	}

	useEffect(() => {
		// Listen for changes to authentication state
		const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
			setSession(session);
			setUser(session ? session.user : null);
			if (session && session.user) await getProfile(session.user.id);
		});
		return () => {
			data.subscription.unsubscribe();
		};
	}, []);

	// Log out the user
	const signOut = async () => {
		await supabase.auth.signOut();
	};

	const value = {
		user,
		session,
		initialized,
		signOut,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
