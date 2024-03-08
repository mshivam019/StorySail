import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import { useApp } from "../../context/AppContext";

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
			<Tabs>
				<Tabs.Screen
					name="one"
					options={{
						title: "Home",
						tabBarIcon: ({ color }) => (
							<TabBarIcon name="home" color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="two"
					options={{
						title: "Profile",
						tabBarIcon: ({ color }) => (
							<TabBarIcon name="user" color={color} />
						),
					}}
				/>
			</Tabs>
		);
	else return <Redirect href="/login" />;
}
