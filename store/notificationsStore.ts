import { create } from "zustand";
import { persist , createJSONStorage } from "zustand/middleware";
import zustandStorage from "./zustandStore";
import { supabase } from "../lib/supabase";

export interface Notification {
	id: string; // Unique identifier for the starred writing
	body: string; // body of the notification
	title: string; // Title of the notification
}

export interface StarStore {
	notifications: Notification[];
	lastfetch: Date;
	setLastFetch: (state: Date) => void;
	setNotifications: (state: Notification[]) => void;
	addNotification: (notification: Notification) => void;
	getNotifications: () => Promise<void>;
	deleteNotification: (id: string) => Promise<void>;
}

const useNotificationStore = create<StarStore>()(
	persist(
		(set, get) => ({
			notifications: [] as Notification[],
			lastfetch: new Date("2021-01-01T00:00:00Z"),
			setLastFetch: (state: Date) => {
				set({ lastfetch: state });
			},
			setNotifications: (state: Notification[]) => {
				set({ notifications: state });
			},
			addNotification: (notification: Notification) => {
				if (get().notifications.length === 0) {
					set({ notifications: [notification] });
					return;
				}
				// check if the notification already exists in the store
				// if it does, ignore
				if (get().notifications.find((n) => n.id === notification.id)) {
					return;
				}
				// if it doesn't, add the notification to the store
				set({ notifications: [notification, ...get().notifications] });
			},
			getNotifications: async () => {
				const session = await supabase.auth.getSession();
				const { data, error } = await supabase
					.from("notifications")
					.select("*")
					.eq("user_id", session?.data.session?.user?.id)
					.limit(20)
					.order("created_at", { ascending: false });
				if (error) {
					console.error(
						"Error getting notifications:",
						error.message
					);
					return;
				}
				if (data) {
					set({ notifications: data });
				}
			},
			deleteNotification: async (id: string) => {
				const { error } = await supabase
					.from("notifications")
					.delete()
					.eq("id", id);
				if (error) {
					console.error(
						"Error deleting notification:",
						error.message
					);
					return;
				}
				set({
					notifications: get().notifications.filter(
						(n) => n.id !== id
					),
				});
			}
		}),
		{
			name: "notification-storage",
			storage: createJSONStorage(() => zustandStorage),
		}
	)
);

export default useNotificationStore;
