import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
	StyleSheet,
	View,
	Alert,
	Button,
	TextInput,
	Image,
	Pressable,
	Text,
} from "react-native";
import { Session } from "@supabase/supabase-js";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { Redirect } from "expo-router";

export default function Account({ session }: { session: Session | null }) {
	const [loading, setLoading] = useState(true);
	const [username, setUsername] = useState("");
	const [website, setWebsite] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const [full_name, setFull_name] = useState("");

	if (!session) {
		return <Redirect href={"/login"} />;
	}

	useEffect(() => {
		if (session) getProfile();
	}, [session]);

	async function getProfile() {
		try {
			setLoading(true);
			if (!session?.user) throw new Error("No user on the session!");

			const { data, error, status } = await supabase
				.from("profiles")
				.select(`username, website, avatar_url,full_name`)
				.eq("id", session?.user.id)
				.single();
			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setUsername(data.username);
				setWebsite(data.website);
				setAvatarUrl(data.avatar_url);
				setFull_name(data.full_name);
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message);
			}
		} finally {
			setLoading(false);
		}
	}

	async function updateProfile({
		username,
		website,
		avatar_url,
		full_name,
	}: {
		username: string;
		website: string;
		avatar_url: string;
		full_name: string;
	}) {
		try {
			setLoading(true);
			if (!session?.user) throw new Error("No user on the session!");

			const updates = {
				id: session?.user.id,
				username,
				website,
				full_name,
				avatar_url,
				updated_at: new Date(),
			};

			const { error } = await supabase.from("profiles").upsert(updates);

			if (error) {
				throw error;
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message);
			}
		} finally {
			setLoading(false);
		}
	}

	const avatarChange = async () => {
		const { status } =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			Alert.alert(
				"Sorry, we need camera roll permissions to make this work!"
			);
			return;
		}
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (result.canceled) {
			return;
		}
		const img = result.assets[0];
		const base64 = await FileSystem.readAsStringAsync(img.uri, {
			encoding: "base64",
		});
		const filePath = `${session.user!.id}/${new Date().getTime()}.${
			img.type === "image" ? "png" : "mp4"
		}`;
		const contentType = img.type === "image" ? "image/png" : "video/mp4";
		const { data, error } = await supabase.storage
			.from("files")
			.upload(filePath, decode(base64), { contentType });
		if (error) {
			Alert.alert(error.message);
		} else {
			const output = supabase.storage
				.from("files")
				.getPublicUrl(data?.path);
			setAvatarUrl(output.data?.publicUrl);
		}
	};

	return (
		<View style={styles.container}>
			<Pressable
				style={styles.imageContainerStyle}
				onPress={async () => {
					avatarChange();
				}}
			>
				{avatarUrl ? (
					<Image
						source={{ uri: avatarUrl }}
						style={{ width: 150, height: 150 }}
					/>
				) : (
					<Image
						source={{
							uri: "https://www.gravatar.com/avatar/?d=identicon",
						}}
						style={{ width: 150, height: 150 }}
					/>
				)}
			</Pressable>
			<View style={[styles.verticallySpaced, styles.mt20]}>
				<Text style={styles.text}>Email : {session?.user?.email}</Text>
			</View>
			<View style={styles.verticallySpaced}>
				<TextInput
					value={username}
					onChangeText={(text) => setUsername(text)}
					style={styles.input}
					placeholder="username here"
				/>
			</View>
			<View style={styles.verticallySpaced}>
				<TextInput
					value={full_name}
					onChangeText={(text) => setFull_name(text)}
					style={styles.input}
					placeholder="full name here"
				/>
			</View>
			<View style={styles.verticallySpaced}>
				<TextInput
					value={website}
					onChangeText={(text) => setWebsite(text)}
					style={styles.input}
					placeholder="website here"
				/>
			</View>

			<View style={[styles.verticallySpaced, styles.mt20]}>
				<Button
					title={loading ? "Loading ..." : "Update"}
					onPress={() =>
						updateProfile({
							username,
							website,
							avatar_url: avatarUrl,
							full_name,
						})
					}
					disabled={loading}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 40,
		padding: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	verticallySpaced: {
		paddingTop: 4,
		paddingBottom: 4,
		alignSelf: "stretch",
	},
	imageContainerStyle: {
		paddingTop: 4,
		paddingBottom: 4,
		alignSelf: "center",
	},
	mt20: {
		marginTop: 20,
	},
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		width: "auto",
	},
	text: {
		padding: 10,
		width: "auto",
	},
});
