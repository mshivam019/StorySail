
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const zustandStorage = {
	setItem: (name: string, value: string | number | boolean | Uint8Array) => storage.set(name, value),
	getItem: (name: string) => {
		const value = storage.getString(name);
		return value ?? null;
	},
	removeItem: (name: string) => storage.delete(name),
};

export default zustandStorage;