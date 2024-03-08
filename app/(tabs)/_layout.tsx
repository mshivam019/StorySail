import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import { useApp } from "../../context/appContext";

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const { session } = useApp() as { session: any };
	if (session && session?.user)
		return (
			<Tabs
				screenOptions={{
					headerShown: false,
				}}
			>
				<Tabs.Screen
					name="one"
					options={{
						title: "One",
						tabBarIcon: ({ color }) => (
							<TabBarIcon name="film" color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="two"
					options={{
						title: "Two",
						tabBarIcon: ({ color }) => (
							<TabBarIcon name="list" color={color} />
						),
					}}
				/>
			</Tabs>
		);
	else return <Redirect href="/login" />;
}
