import React, { useEffect, useState, useRef } from "react";
import { Redirect, withLayoutContext } from "expo-router";
import { useAuth } from "../../provider/AuthProvider";
import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";
import {
	createMaterialTopTabNavigator,
	MaterialTopTabNavigationOptions,
	MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { ActivityIndicator, Keyboard, View } from "react-native";
import { CustomBottomSheetModal } from "../../components";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

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
						lazy: true,
						lazyPreloadDistance: 0,
						lazyPlaceholder: () => {
							return (
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
							);
						},
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
						name="notifications"
						options={{
							lazy: true,
							tabBarIcon: (props) => (
								<EvilIcons
									name="bell"
									style={{ fontSize: 30 }}
									{...props}
								/>
							),
						}}
					/>
				</MaterialTopTabs>
			</>
		);
	else return <Redirect href="/login" />;
}
