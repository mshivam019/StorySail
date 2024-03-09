import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { StyleSheet, View, Alert, Button, TextInput } from "react-native";
import { Session } from "@supabase/supabase-js";
import Push from "./Push";
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

	return (
		<View style={styles.container}>
			<View style={[styles.verticallySpaced, styles.mt20]}>
				<TextInput value={session?.user?.email} editable={false} />
			</View>
			<View style={styles.verticallySpaced}>
				<TextInput
					value={username || "username here"}
					onChangeText={(text) => setUsername(text)}
					style={styles.input}
				/>
			</View>
			<View style={styles.verticallySpaced}>
				<TextInput
					value={website || "website here"}
					onChangeText={(text) => setWebsite(text)}
					style={styles.input}
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


			<View style={[styles.verticallySpaced, { height: 200 }]}>
				<Push session={session} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 40,
		padding: 12,
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
