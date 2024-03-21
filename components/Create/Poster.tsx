import React, { useState, useRef } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import Toast, { ToastRef } from "../CustomToast";
import { useWritingsStore } from "../../store";

const Poster = ({
	article,
	setShowEditor,
	title,
	setTitle,
	img,
	setImg,
}: {
	article: string;
	setShowEditor: (show: boolean) => void;
	title: string;
	setTitle: (title: string) => void;
	img: string;
	setImg: (img: string) => void;
}) => {
	const toastRef = useRef<ToastRef>(null);
	const { addArticle } = useWritingsStore();
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
			let result = await ImagePicker.launchImageLibraryAsync({
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
				<Image
					source={{ uri: img }}
					style={{ width: 200, height: 200, alignSelf: "center" }}
				/>
			)}

			<Button
				title="Upload Poster"
				onPress={() => {
					ImageUploadHandler();
				}}
			/>
			<Button title="Publish" onPress={() => {}} />
			<Button
				title="Save Draft"
				onPress={() => {
					const error = addArticle({
						title,
						content: article,
						img: img,
						date: new Date(),
					});
					if (error) {
						toastRef.current?.show({
							type: "error",
							text: "Duplicate title!",
							duration: 2000,
						});
						return;
					}
					toastRef.current?.show({
						type: "success",
						text: "Draft saved",
						duration: 2000,
					});
				}}
			/>
			<Button
				title="Go Back"
				onPress={() => {
					setShowEditor(true);
				}}
			/>
			<Toast ref={toastRef} />
		</View>
	);
};

export default Poster;

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
