import { createContext, useContext, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";

interface AppContextProps {
	session: Session | null;
}

interface AppProviderProps {
	children: ReactNode;
	session: Session | null;
}

export const AppContext = createContext<AppContextProps | null>(null);

export const useApp = () => useContext(AppContext);

const AppProvider = ({ children, session = null }: AppProviderProps) => {
	return (
		<AppContext.Provider value={{ session }}>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;
