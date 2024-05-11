import React, { useEffect, useState } from "react";
import { Redirect, withLayoutContext } from "expo-router";
import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";
import {
	createMaterialTopTabNavigator,
	MaterialTopTabNavigationOptions,
	MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { ActivityIndicator, Keyboard, View } from "react-native";
import { useAuth } from "../../provider/AuthProvider";
import { CustomBottomSheetModal } from "../../components";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
	MaterialTopTabNavigationOptions,
	typeof Navigator,
	TabNavigationState<ParamListBase>,
	MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
	const { session, bottomSheetRef } = useAuth();
	const [keyboardVisible, setKeyboardVisible] = useState(false);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			() => {
				setKeyboardVisible(true);
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				setKeyboardVisible(false);
			}
		);

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);
	const tabBarDisplay: "none" | undefined = keyboardVisible
		? "none"
		: undefined;
	if (session && session?.user)
		return (
			<>
				<CustomBottomSheetModal ref={bottomSheetRef} />
				<MaterialTopTabs
					tabBarPosition="bottom"
					initialRouteName="home"
					screenOptions={{
						animationEnabled: false,
						lazy: true,
						lazyPreloadDistance: 0,
						lazyPlaceholder: () => (
								<View
									style={{
										flex: 1,
										backgroundColor: "white",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<ActivityIndicator
										size="large"
										color="black"
									/>
								</View>
							),
						tabBarInactiveTintColor: "gray",
						tabBarActiveTintColor: "black",
						tabBarShowIcon: true,
						tabBarShowLabel: false,
						tabBarGap: 0,
						tabBarStyle: {
							display: tabBarDisplay,
							backgroundColor: "white",
							borderTopColor: "rgba(0, 0, 0, 0.1)",
							borderTopWidth: 1,
						},
						tabBarIndicatorStyle: {
							backgroundColor: "black",
							position: "absolute",
							top: -1,
						},
					}}
				>
					<MaterialTopTabs.Screen
						name="home"						
						options={{
							lazy: true,
							title: "Home",
							tabBarLabel: "Home",
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
							lazy: true,
							tabBarLabel: "Explore",
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
							lazy: true,
							tabBarLabel: "Create",
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
							lazy: true,
							tabBarLabel: "Favourites",
							tabBarIcon: (props) => (
								<EvilIcons
									name="star"
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
						name="account"
						options={{
							lazy: true,
							tabBarLabel: "Account",
							tabBarIcon: (props) => (
								<EvilIcons
									name="user"
									style={{
										fontSize: 30,
										marginLeft: -1,
									}}
									{...props}
								/>
							),
						}}
					/>
				</MaterialTopTabs>
			</>
		);
	return <Redirect href="/login" />;
}
