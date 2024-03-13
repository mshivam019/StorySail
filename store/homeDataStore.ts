import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const zustandStorage = {
	setItem: (name: string, value: string | number | boolean | Uint8Array) => {
		return storage.set(name, value);
	},
	getItem: (name: string) => {
		const value = storage.getString(name);
		return value ?? null;
	},
	removeItem: (name: string) => {
		return storage.delete(name);
	},
};



export interface HomeDataStore {
	lastCheckinDate: string;
    setLastCheckinDate: () => void;
}

const useHomeDataStore = create<HomeDataStore>()(
	persist(
		(set) => ({
			lastCheckinDate: '',
            setLastCheckinDate: () => {
                set({
                    lastCheckinDate: new Date().toISOString(),
                });
            },
		}),
		{
			name: "home-data-storage",
			storage: createJSONStorage(() => zustandStorage),
		}
	)
);

export default useHomeDataStore;
