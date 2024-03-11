import React from "react";
import { Redirect, withLayoutContext } from "expo-router";
import { useAuth } from "../../provider/AuthProvider";
import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";
import {
	createMaterialTopTabNavigator,
	MaterialTopTabNavigationOptions,
	MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
	MaterialTopTabNavigationOptions,
	typeof Navigator,
	TabNavigationState<ParamListBase>,
	MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
	const { session } = useAuth();
	if (session && session?.user)
		return (
			<MaterialTopTabs
				tabBarPosition="bottom"
				initialRouteName="home"
				screenOptions={{
					tabBarInactiveTintColor: "gray",
					tabBarActiveTintColor: "black",
					tabBarShowIcon: true,
					tabBarShowLabel: false,
					tabBarGap: 0,
					tabBarStyle: {
						backgroundColor: "white",
						borderTopColor: "rgba(0, 0, 0, 0.1)",
						borderTopWidth: 1,
					},
					tabBarIndicatorStyle: {
						backgroundColor: "black",
						position: "absolute",
						top: 0,
					},
				}}
			>
				<MaterialTopTabs.Screen
					name="home"
					options={{
						title: "Home",
						tabBarIcon: (props) => (
							<AntDesign
								name="home"
								style={{ marginBottom: -3, fontSize: 26 }}
								{...props}
							/>
						),
					}}
				/>
				<MaterialTopTabs.Screen
					name="explore"
					options={{
						tabBarIcon: (props) => (
							<EvilIcons
								name="search"
								style={{ fontSize: 30 }}
								{...props}
							/>
						),
					}}
				/>
				<MaterialTopTabs.Screen
					name="create"
					options={{
						tabBarIcon: (props) => (
							<Ionicons
								name="create-outline"
								style={{ marginBottom: -3, fontSize: 27 }}
								{...props}
							/>
						),
					}}
				/>
				<MaterialTopTabs.Screen
					name="favourites"
					options={{
						tabBarIcon: (props) => (
							<EvilIcons
								name="heart"
								style={{
									fontSize: 30,
									marginLeft: -1,
								}}
								{...props}
							/>
						),
					}}
				/>
				<MaterialTopTabs.Screen
					name="notifications"
					options={{
						tabBarIcon: (props) => (
							<EvilIcons
								name="bell"
								style={{fontSize: 30 }}
								{...props}
							/>
						),
					}}
				/>
			</MaterialTopTabs>
		);
	else return <Redirect href="/login" />;
}
