import React, { useState } from "react";
import { Alert, StyleSheet, View, Button, TextInput } from "react-native";
import { supabase } from "../lib/supabase";
import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes,
} from "@react-native-google-signin/google-signin";

export default function Auth() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	GoogleSignin.configure({
		scopes: ["https://www.googleapis.com/auth/drive.readonly"],
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

	return (
		<View style={styles.container}>
			<View style={[styles.verticallySpaced, styles.mt20]}>
				<TextInput
					onChangeText={(text) => setEmail(text)}
					value={email}
					placeholder="email@address.com"
					autoCapitalize={"none"}
					style={styles.input}
				/>
			</View>
			<View style={styles.verticallySpaced}>
				<TextInput
					onChangeText={(text) => setPassword(text)}
					value={password}
					secureTextEntry={true}
					placeholder="Password"
					autoCapitalize={"none"}
					style={styles.input}
				/>
			</View>
			<View style={[styles.verticallySpaced, styles.mt20]}>
				<Button
					title="Sign in"
					disabled={loading}
					onPress={() => signInWithEmail()}
				/>
			</View>
			<View style={styles.verticallySpaced}>
				<Button
					title="Sign up"
					disabled={loading}
					onPress={() => signUpWithEmail()}
				/>
			</View>
			<GoogleSigninButton
				size={GoogleSigninButton.Size.Wide}
				color={GoogleSigninButton.Color.Light}
				onPress={async () => {
					try {
						await GoogleSignin.hasPlayServices();
						const userInfo = await GoogleSignin.signIn();
						if (userInfo.idToken) {
							const { data, error } =
								await supabase.auth.signInWithIdToken({
									provider: "google",
									token: userInfo.idToken,
								});
							console.log(error, data);
						} else {
							throw new Error("no ID token present!");
						}
					} catch (error: any) {
						console.error(error);
						if (error.code === statusCodes.SIGN_IN_CANCELLED) {
							// user cancelled the login flow
						} else if (error.code === statusCodes.IN_PROGRESS) {
							// operation (e.g. sign in) is in progress already
						} else if (
							error.code ===
							statusCodes.PLAY_SERVICES_NOT_AVAILABLE
						) {
							// play services not available or outdated
						} else {
							// some other error happened
						}
					}
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 40,
		padding: 12,
    alignItems: "center",
	},
	verticallySpaced: {
		paddingTop: 4,
		paddingBottom: 4,
		alignSelf: "stretch",
	},
	mt20: {
		marginTop: 20,
	},
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
});
