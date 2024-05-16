import React, { useRef, useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "expo-router";
import uuid from "react-native-uuid";
import { decode } from "base64-arraybuffer";
import Toast, { ToastRef } from "../CustomToast";
import { useAuth } from "../../provider/AuthProvider";
import { useWritingsStore, UserWriting } from "../../store";
import { supabase } from "../../lib/supabase";
import DropDown from "../ExpandableDropDown";
import DynamicInput from "./DynamicInput";

function Preview({
	article,
	setShowEditor,
}: {
	article: UserWriting;
	setShowEditor: (show: boolean) => void;
}) {
	const toastRef = useRef<ToastRef>(null);
	const { addArticle, saveDraft } = useWritingsStore();
	const [title, setTitle] = useState(article.title || "");
	const [uploading, setUploading] = useState(false);
	const [img, setImg] = useState(article.poster_image_url || "");
	const [category, setCategory] = useState(article.category || "");
	const [tags, setTags] = useState(article.tags || []);
	const { session } = useAuth();
	const data = {
		title: "Category",
		content: [
			"Fantasy",
			"Adventure",
			"Romance",
			"Mystery",
			"Horror",
			"Science Fiction",
		],
	};
	const user = session?.user;

	const navigation = useNavigation();
	useEffect(() => {
		const backHandler = navigation.addListener("beforeRemove", (e) => {
			e.preventDefault();
			setShowEditor(true);
		});
		return backHandler;
	}, [navigation]);

	const ImageUploadHandler = async () => {
		try {
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== "granted") {
				toastRef.current?.show({
					type: "error",
					text: "Permission denied!",
					duration: 2000,
				});

				return;
			}
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});

			if (result.canceled) {
				return;
			}
			setImg(result.assets[0].uri);
		} catch (e) {
			console.log(e);
		}
	};

	const getPublicUrl = async () => {
		if (!img) return "";
		if (img.startsWith("http")) return img;
		if (!session) return "";
		if (!user) return "";
		const uniqueName = new Date().getTime();
		const base64 = await FileSystem.readAsStringAsync(img, {
			encoding: "base64",
		});
		const filePath = `${session.user!.id}/writings/${uniqueName}.${
			img.split(".").pop() ?? "png"
		}`;
		const contentType = "image/png";
		const { data, error } = await supabase.storage
			.from("files")
			.upload(filePath, decode(base64), { contentType });
		if (error) {
			toastRef.current?.show({
				type: "error",
				text: "Error uploading image",
				duration: 2000,
			});
		} else {
			const output = supabase.storage
				.from("files")
				.getPublicUrl(data?.path);
			setImg(output.data.publicUrl);
			if (output.data.publicUrl) return output.data.publicUrl;
		}
		return "";
	};
	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder="Title"
				placeholderTextColor="gray"
				value={title}
				onChangeText={(text) => setTitle(text)}
				maxLength={50}
			/>
			{img && (
				<Pressable
					onPress={() => {
						ImageUploadHandler();
					}}
				>
					<Image
						source={{ uri: img }}
						style={{ width: 200, height: 200, alignSelf: "center" }}
					/>
				</Pressable>
			)}

			<DropDown data={data} value={category} setValue={setCategory} />

			<DynamicInput
				data={tags}
				set={setTags}
				placeHolderTextColor="gray"
				placeholder="Add Tags"
				textStyle={{ fontSize: 12 }}
				itemColor="#2f7fff"
				roundedItem={10}
				style={{
					borderBottomWidth: 1,
					borderBottomColor: "black",
					marginVertical: 20,
					color: "#000000",
				}} btnHeight={0}
				btnColor="#fff" 
				backgroundColor=""			
			/>

			<Button
				title="Upload Poster"
				onPress={() => {
					ImageUploadHandler();
				}}
			/>
			<Button
				title="Publish"
				disabled={uploading}
				onPress={() => {
					if (uploading) return;
					setUploading(true);
					getPublicUrl()
						.then(async (url) => {
							if (
								url &&
								user &&
								user.id &&
								title.trim() &&
								article.content.trim() &&
								category.trim()
							) {
								const result = await addArticle({
									id: article.id,
									title,
									content: article.content,
									poster_image_url: url,
									tags,
									category,
									stars_count: 0,
									user_id: user.id,
									created_at: new Date(),
									updated_at: new Date(),
								});
								if (result instanceof Error) {
									toastRef.current?.show({
										type: "error",
										text: "Error publishing article",
										duration: 2000,
									});
								} else {
									toastRef.current?.show({
										type: "success",
										text: "Article published",
										duration: 2000,
									});
								}
							} else {
								toastRef.current?.show({
									type: "error",
									text: "Error publishing article please fill all fields and upload an image",
									duration: 4000,
								});
							}
						})
						.catch((e) => {
							console.log(e);
							toastRef.current?.show({
								type: "error",
								text: "An error occurred",
								duration: 2000,
							});
						})
						.finally(() => {
							setUploading(false);
						});
				}}
			/>
			<Button
				title="Save Draft"
				onPress={() => {
					if (title.trim() && article.content.trim()) {
						saveDraft({
							id: uuid.v4().toString(),
							title,
							content: article.content,
							category,
							tags,
							poster_image_url: img,
							stars_count: 0,
							user_id: "1",
							created_at: new Date(),
							updated_at: new Date(),
						});

						toastRef.current?.show({
							type: "success",
							text: "Draft saved",
							duration: 2000,
						});
					} else {
						toastRef.current?.show({
							type: "error",
							text: "Error saving draft please fill all fields",
							duration: 4000,
						});
					}
				}}
			/>
			<Toast ref={toastRef} />
		</View>
	);
}

export default Preview;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "white",
		gap: 20,
	},
	input: {
		borderBottomWidth: 1,
		borderBottomColor: "black",
		marginVertical: 20,
	},
});
