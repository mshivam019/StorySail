import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {createJSONStorage} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';

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

const useUserStore = create(
    persist(
        (set) => ({
            isFirstLogin: true,
            setIsFirstLogin: (state: boolean) => {
                set({
                    isFirstLogin: state,
                });
            },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => zustandStorage),
        },
    ),
);

export default useUserStore