import React, { useState, useRef } from "react";
import {
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
import {
	GoogleSignin,
	statusCodes,
} from "@react-native-google-signin/google-signin";
import LottieView from "lottie-react-native";
import { Image as ExpoImage } from "expo-image";
import { Toast, ToastRef } from "../components";
import { supabase } from "../lib/supabase";


const { height, width } = Dimensions.get("window");

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const toastRef = useRef<ToastRef>(null);
	const imagePosition = useSharedValue(1);
	const formButtonScale = useSharedValue(1);
	const [isRegistering, setIsRegistering] = useState(false);

	GoogleSignin.configure({
		webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
		offlineAccess: true,
	});

	async function signInWithEmail() {
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error)
			toastRef.current?.show({
				type: "error",
				text: "Invalid email or password!",
				duration: 2000,
			});
		setLoading(false);
	}

	async function signUpWithEmail() {
		setLoading(true);
		const {
			data: { session },
			error,
		} = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			toastRef.current?.show({
				type: "error",
				text: error.message,
				duration: 2000,
			});
		}
		if (!session)
			toastRef.current?.show({
				type: "error",
				text: "Error signing up!",
				duration: 2000,
			});
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
					rotate: withTiming(`${interpolation  }deg`, {
						duration: 1000,
					}),
				},
			],
		};
	});

	const formAnimatedStyle = useAnimatedStyle(() => ({
			opacity:
				imagePosition.value === 0
					? withDelay(400, withTiming(1, { duration: 800 }))
					: withTiming(0, { duration: 300 }),
		}));

	const formButtonAnimatedStyle = useAnimatedStyle(() => ({
			transform: [{ scale: formButtonScale.value }],
		}));

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
		formButtonScale.value = withSequence(withSpring(0.8), withSpring(1));
		if (!email || !password) {
			toastRef.current?.show({
				type: "error",
				text: "Please fill in all fields!",
				duration: 2000,
			});
			return;
		}
		if (isRegistering) {
			signUpWithEmail();
		} else {
			signInWithEmail();
		}
	};
	return (
		<View style={{ flex: 1 }}>
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
							source={require("../assets/login/hello.json")}
						/>
						<ClipPath id="clipPathId">
							<Ellipse
								cx={width / 2}
								rx={height}
								ry={height + 100}
							/>
						</ClipPath>
						<Image
							href={require("../assets/login/loginBackground.png")}
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
								autoCapitalize="none"
							/>
							<TextInput
								placeholder="Password"
								placeholderTextColor="black"
								style={styles.textInput}
								onChangeText={(text) => setPassword(text)}
								value={password}
								secureTextEntry
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
							<Pressable
								style={({ pressed }) => [
									styles.googleButton,
									{
										transform: [
											{ scale: pressed ? 0.9 : 1 },
										],
									},
								]}
								onPress={async () => {
									if (loading) return;
									try {
										setLoading(true);
										await GoogleSignin.hasPlayServices();
										const userInfo =
											await GoogleSignin.signIn();
										if (userInfo.idToken) {
											const { error } =
												await supabase.auth.signInWithIdToken(
													{
														provider: "google",
														token: userInfo.idToken,
													}
												);
											console.log(error);
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
											toastRef.current?.show({
												type: "error",
												text: "Sign in cancelled!",
												duration: 2000,
											});
										} else if (
											error.code ===
											statusCodes.IN_PROGRESS
										) {
											toastRef.current?.show({
												type: "error",
												text: "Sign in in progress!",
												duration: 2000,
											});
										} else if (
											error.code ===
											statusCodes.PLAY_SERVICES_NOT_AVAILABLE
										) {
											toastRef.current?.show({
												type: "error",
												text: "Play services not available!",
												duration: 2000,
											});
										} else {
											toastRef.current?.show({
												type: "error",
												text: "Error signing in!",
												duration: 2000,
											});
										}
									} finally {
										setLoading(false);
									}
								}}
							>
								<ExpoImage
									source={require("../assets/login/googleIcon.png")}
									style={styles.googleButtonIcon}
								/>
								<Text style={styles.googleButtonText}>
									Sign in with Google
								</Text>
							</Pressable>
						</Animated.View>
					</View>
				</KeyboardAvoidingView>
			</Animated.View>
			<Toast ref={toastRef} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-end",
	},
	button: {
		backgroundColor: "white",
		height: 55,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 35,
		marginHorizontal: 20,
		marginVertical: 10,
		borderWidth: 1,
	},
	buttonText: {
		fontSize: 20,
		fontWeight: "600",
		color: "#9348cc",
		letterSpacing: 0.5,
	},
	googleButton: {
		backgroundColor: "#fff",
		height: 55,
		width: width * 0.9,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 35,
		marginHorizontal: 20,
		marginVertical: 10,
		borderWidth: 1,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		flexDirection: "row",
	},
	actionButtonText: {
		fontSize: 20,
		fontWeight: "600",
		color: "white",
		letterSpacing: 0.5,
	},
	googleButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#000",
		letterSpacing: 0.5,
	},
	googleButtonIcon: {
		height: 30,
		width: 30,
		marginRight: 10,
	},
	bottomContainer: {
		justifyContent: "center",
		height: height / 3,
		width,
	},
	textInput: {
		height: 50,
		width: width * 0.9,
		borderWidth: 1,
		borderColor: "rgba(0, 0, 0, 0.2)",
		marginHorizontal: 20,
		marginVertical: 10,
		borderRadius: 25,
		paddingLeft: 10,
		backgroundColor: "white",
	},
	formButton: {
		backgroundColor: "rgba(123,104,238,0.8)",
		height: 55,
		width: width * 0.9,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 35,
		marginHorizontal: 20,
		marginVertical: 10,
		borderWidth: 1,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	formInputContainer: {
		marginTop: 20,
		marginBottom: 60,
		...StyleSheet.absoluteFillObject,
		zIndex: -1,
		justifyContent: "center",
		alignItems: "center",
	},
	closeButtonContainer: {
		height: 40,
		width: 40,
		justifyContent: "center",
		alignSelf: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.34,
		shadowRadius: 6.27,
		elevation: 1,
		backgroundColor: "white",
		alignItems: "center",
		borderRadius: 20,
		top: -20,
	},
});

