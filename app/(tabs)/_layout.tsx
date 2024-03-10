import React, { useRef } from "react";
import { Redirect, Tabs } from "expo-router";
import { useAuth } from "../../provider/AuthProvider";
import { Pressable } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CustomBottomSheetModal } from "../../components";
import { AntDesign, Feather } from "@expo/vector-icons";

function TabBarIcon(props: {
	name: React.ComponentProps<typeof AntDesign>["name"];
	color: string;
}) {
	return <AntDesign size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const { session } = useAuth();
	const bottomSheetRef = useRef<BottomSheetModal>(null);

	const handlePresentModalPress = () => bottomSheetRef.current?.present();
	if (session && session?.user)
		return (
			<>
				<CustomBottomSheetModal ref={bottomSheetRef} />
				<Tabs
					screenOptions={{
						tabBarActiveTintColor: "black",
						tabBarInactiveTintColor: "gray",
						tabBarShowLabel: false,
						tabBarHideOnKeyboard: true,
						headerLeft: () => (
							<AntDesign
								name="earth"
								size={24}
								style={{ marginLeft: 20 }}
							/>
						),
						headerTitle: "Expobase",
						headerRight: () => (
							<Pressable
								onPress={() => {
									handlePresentModalPress();
								}}
							>
								<AntDesign
									name="setting"
									size={24}
									style={{ marginRight: 20 }}
								/>
							</Pressable>
						),
					}}
				>
					<Tabs.Screen
						name="home"
						options={{
							title: "Home",
							tabBarIcon: (props) => (
								<TabBarIcon name="home" color={props.color} />
							),
						}}
					/>
					<Tabs.Screen
						name="explore"
						options={{
							tabBarIcon: (props) => (
								<TabBarIcon
									name="search1"
									color={props.color}
								/>
							),
						}}
					/>
					<Tabs.Screen
						name="notifications"
						options={{
							tabBarIcon: (props) => (
								<Feather
									name="bell"
									style={{ marginBottom: -3, fontSize: 28 }}
									{...props}
								/>
							),
						}}
					/>
					<Tabs.Screen
						name="profile"
						options={{
							href: null,
						}}
					/>
					<Tabs.Screen
						name="settings"
						options={{
							href: null,
						}}
					/>
				</Tabs>
			</>
		);
	else return <Redirect href="/login" />;
}
