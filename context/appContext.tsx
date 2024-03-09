import {
	createContext,
	useContext,
	ReactNode,
	useState,
	useEffect,
} from "react";
import { Session } from "@supabase/supabase-js";

interface AppContextProps {
	session: Session | null;
}

interface AppProviderProps {
	children: ReactNode;
	sess: Session | null;
}

export const AppContext = createContext<AppContextProps | null>(null);

export const useApp = () => useContext(AppContext);

const AppProvider = ({ children, sess = null }: AppProviderProps) => {
	const [session, setSession] = useState<Session | null>(sess);
	useEffect(() => {
		if (sess && sess?.user) {
			setSession(sess);
		} else {
			setSession(null);
		}
	}, [sess]);

	return (
		<AppContext.Provider value={{ session }}>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;
