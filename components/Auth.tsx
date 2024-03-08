import React, { useState } from "react";
import {
	Alert,
	View,
	TextInput,
	Text,
	Dimensions,
	Pressable,
	StyleSheet,
	KeyboardAvoidingView,
	Keyboard,
} from "react-native";
import Svg, { Image, Ellipse, ClipPath } from "react-native-svg";
import styles from "../styles/loginStyles";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	interpolate,
	withTiming,
	withDelay,
	runOnJS,
	withSequence,
	withSpring,
} from "react-native-reanimated";
import { supabase } from "../lib/supabase";
import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes,
} from "@react-native-google-signin/google-signin";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Auth() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { height, width } = Dimensions.get("window");
	const imagePosition = useSharedValue(1);
	const formButtonScale = useSharedValue(1);
	const [isRegistering, setIsRegistering] = useState(false);

	GoogleSignin.configure({
		webClientId:
			"537241639551-pbpfuoe8kh9g22uc66pomohe5sho1545.apps.googleusercontent.com",
		offlineAccess: true,
	});

	async function signInWithEmail() {
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) Alert.alert(error.message);
		setLoading(false);
	}

	async function signUpWithEmail() {
		setLoading(true);
		const {
			data: { session },
			error,
		} = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (error) Alert.alert(error.message);
		if (!session)
			Alert.alert("Please check your inbox for email verification!");
		setLoading(false);
	}

	const imageAnimatedStyle = useAnimatedStyle(() => {
		const interpolation = interpolate(
			imagePosition.value,
			[0, 1],
			[-height / 2, 0]
		);
		return {
			transform: [
				{ translateY: withTiming(interpolation, { duration: 1000 }) },
			],
		};
	});

	const buttonsAnimatedStyle = useAnimatedStyle(() => {
		const interpolation = interpolate(
			imagePosition.value,
			[0, 1],
			[250, 0]
		);
		return {
			opacity: withTiming(imagePosition.value, { duration: 500 }),
			transform: [
				{ translateY: withTiming(interpolation, { duration: 1000 }) },
			],
		};
	});

	const closeButtonContainerStyle = useAnimatedStyle(() => {
		const interpolation = interpolate(
			imagePosition.value,
			[0, 1],
			[180, 360]
		);
		return {
			opacity: withTiming(imagePosition.value === 1 ? 0 : 1, {
				duration: 800,
			}),
			transform: [
				{
					rotate: withTiming(interpolation + "deg", {
						duration: 1000,
					}),
				},
			],
		};
	});

	const formAnimatedStyle = useAnimatedStyle(() => {
		return {
			opacity:
				imagePosition.value === 0
					? withDelay(400, withTiming(1, { duration: 800 }))
					: withTiming(0, { duration: 300 }),
		};
	});

	const formButtonAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: formButtonScale.value }],
		};
	});

	const loginHandler = () => {
		imagePosition.value = 0;
		if (isRegistering) {
			runOnJS(setIsRegistering)(false);
		}
	};

	const registerHandler = () => {
		imagePosition.value = 0;
		if (!isRegistering) {
			runOnJS(setIsRegistering)(true);
		}
	};

	const buttonHandler = () => {
		if (loading) return;
		formButtonScale.value = withSequence(withSpring(1.5), withSpring(1));
		if (!email || !password) {
			Alert.alert("Please fill in all fields!");
			return;
		}
		if (isRegistering) {
			signUpWithEmail();
		} else {
			signInWithEmail();
		}
	};
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Animated.View style={styles.container}>
				<Animated.View
					style={[StyleSheet.absoluteFill, imageAnimatedStyle]}
				>
					<Svg height={height + 100} width={width + 100}>
						<LottieView
							autoPlay
							style={{
								position: "absolute",
								width: 350,
								height: 350,
								zIndex: 1,
								top: height / 30,
								right: width / 3,
							}}
							source={require("../assets/hello2.json")}
						/>
						<ClipPath id="clipPathId">
							<Ellipse
								cx={width / 2}
								rx={height}
								ry={height + 100}
							/>
						</ClipPath>
						<Image
							href={require("../assets/loginBackground.png")}
							width={width + 100}
							height={height + 100}
							preserveAspectRatio="xMidYMid slice"
							clipPath="url(#clipPathId)"
						/>
					</Svg>
					<Pressable
						onPress={() => {
							imagePosition.value = 1;
							Keyboard.dismiss();
						}}
					>
						<Animated.View
							style={[
								styles.closeButtonContainer,
								closeButtonContainerStyle,
							]}
						>
							<Text style={styles.buttonText}>X</Text>
						</Animated.View>
					</Pressable>
				</Animated.View>
				<KeyboardAvoidingView behavior="height">
					<View style={styles.bottomContainer}>
						<Animated.View style={buttonsAnimatedStyle}>
							<Pressable
								style={styles.button}
								onPress={loginHandler}
							>
								<Text style={styles.buttonText}>LOG IN</Text>
							</Pressable>
						</Animated.View>
						<Animated.View style={buttonsAnimatedStyle}>
							<Pressable
								style={styles.button}
								onPress={registerHandler}
							>
								<Text style={styles.buttonText}>REGISTER</Text>
							</Pressable>
						</Animated.View>
						<Animated.View
							style={[
								styles.formInputContainer,
								formAnimatedStyle,
							]}
						>
							<TextInput
								placeholder="Email"
								placeholderTextColor="black"
								onChangeText={(text) => setEmail(text)}
								value={email}
								style={styles.textInput}
								autoCapitalize={"none"}
							/>
							<TextInput
								placeholder="Password"
								placeholderTextColor="black"
								style={styles.textInput}
								onChangeText={(text) => setPassword(text)}
								value={password}
								secureTextEntry={true}
								autoCapitalize="none"
							/>
							<Animated.View
								style={[
									styles.formButton,
									formButtonAnimatedStyle,
								]}
							>
								<Pressable onPress={() => buttonHandler()}>
									<Text style={styles.actionButtonText}>
										{isRegistering ? "REGISTER" : "LOG IN"}
									</Text>
								</Pressable>
							</Animated.View>
							<GoogleSigninButton
								size={GoogleSigninButton.Size.Wide}
								color={GoogleSigninButton.Color.Light}
								onPress={async () => {
									if (loading) return;
									try {
										setLoading(true);
										await GoogleSignin.hasPlayServices();
										const userInfo =
											await GoogleSignin.signIn();
										if (userInfo.idToken) {
											const { data, error } =
												await supabase.auth.signInWithIdToken(
													{
														provider: "google",
														token: userInfo.idToken,
													}
												);
											console.log(error, data);
										} else {
											throw new Error(
												"no ID token present!"
											);
										}
									} catch (error: any) {
										console.log(error);
										if (
											error.code ===
											statusCodes.SIGN_IN_CANCELLED
										) {
											// user cancelled the login flow
										} else if (
											error.code ===
											statusCodes.IN_PROGRESS
										) {
											// operation (e.g. sign in) is in progress already
										} else if (
											error.code ===
											statusCodes.PLAY_SERVICES_NOT_AVAILABLE
										) {
											// play services not available or outdated
										} else {
											// some other error happened
										}
									} finally {
										setLoading(false);
									}
								}}
							/>
						</Animated.View>
					</View>
				</KeyboardAvoidingView>
			</Animated.View>
		</SafeAreaView>
	);
}
