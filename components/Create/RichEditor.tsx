import React, { useRef, useState } from "react";
import { StyleSheet, Text, ScrollView, Button } from "react-native";
import {
	actions,
	RichEditor,
	RichToolbar,
} from "react-native-pell-rich-editor";
import HTMLView from "react-native-htmlview";
import * as ImagePicker from "expo-image-picker";
import Toast, { ToastRef } from "../CustomToast";

const RichTextEditor = () => {
	const RichText = useRef<RichEditor>(null);
	const [article, setArticle] = useState("");
	const [showPreview, setShowPreview] = useState(false);
	const toastRef = useRef<ToastRef>(null);


	return (
		<ScrollView style={styles.container}>
			{showPreview ? (
				<>
					<Text style={styles.text}>Preview</Text>
					<HTMLView
						value={article}
						stylesheet={styles}
						style={{ padding: 15 }}
					/>
				</>
			) : (
				<>
					<RichToolbar
						style={[styles.richBar]}
						editor={RichText}
						disabled={false}
						iconTint={"gray"}
						selectedIconTint={"black"}
						disabledIconTint={"darkgrey"}
						actions={[
							actions.heading1,
							actions.heading2,
							actions.heading3,
							actions.heading4,
							actions.heading5,
							actions.heading6,
							actions.setParagraph,
							actions.setBold,
							actions.setItalic,
							actions.setUnderline,
						]}
						iconMap={{
							[actions.heading1]: ({
								tintColor,
							}: {
								tintColor: string;
							}) => (
								<Text
									style={[styles.tib, { color: tintColor }]}
								>
									H1
								</Text>
							),
							[actions.heading2]: ({
								tintColor,
							}: {
								tintColor: string;
							}) => (
								<Text
									style={[styles.tib, { color: tintColor }]}
								>
									H2
								</Text>
							),
							[actions.heading3]: ({
								tintColor,
							}: {
								tintColor: string;
							}) => (
								<Text
									style={[styles.tib, { color: tintColor }]}
								>
									H3
								</Text>
							),
							[actions.heading4]: ({
								tintColor,
							}: {
								tintColor: string;
							}) => (
								<Text
									style={[styles.tib, { color: tintColor }]}
								>
									H4
								</Text>
							),
							[actions.heading5]: ({
								tintColor,
							}: {
								tintColor: string;
							}) => (
								<Text
									style={[styles.tib, { color: tintColor }]}
								>
									H5
								</Text>
							),
							[actions.heading6]: ({
								tintColor,
							}: {
								tintColor: string;
							}) => (
								<Text
									style={[styles.tib, { color: tintColor }]}
								>
									H6
								</Text>
							),
							[actions.setParagraph]: ({
								tintColor,
							}: {
								tintColor: string;
							}) => (
								<Text
									style={[styles.tib, { color: tintColor }]}
								>
									P
								</Text>
							),
						}}
					/>
					<RichToolbar
						style={[styles.richBar]}
						editor={RichText}
						disabled={false}
						iconTint={"gray"}
						selectedIconTint={"black"}
						disabledIconTint={"darkgrey"}
						actions={[
							actions.alignLeft,
							actions.alignCenter,
							actions.alignRight,
							actions.alignFull,
							actions.setSubscript,
							actions.setSuperscript,
							actions.insertBulletsList,
							actions.insertOrderedList,
							actions.insertLine,							
							actions.insertLink,
						]}
					/>
					<RichToolbar
						style={[styles.richBar]}
						editor={RichText}
						disabled={false}
						iconTint={"gray"}
						selectedIconTint={"black"}
						disabledIconTint={"darkgrey"}
						actions={[
							actions.undo,
							actions.redo,
							actions.removeFormat,
							actions.checkboxList,
							actions.code,
							actions.setStrikethrough,
							actions.blockquote,
						]}
					/>
					<RichEditor
						containerStyle={styles.editor}
						ref={RichText}
						style={styles.rich}
						placeholder={"Start Writing Here"}
						onChange={(text) => setArticle(text)}
						initialHeight={400}
						initialContentHTML={article}
					/>
				</>
			)}
			<Button
				title={showPreview ? "Show Editor" : "Show Preview"}
				onPress={() => setShowPreview(!showPreview)}
			/>
			<Toast ref={toastRef} />
		</ScrollView>
	);
};

export default RichTextEditor;

const styles = StyleSheet.create({
	a: {
		fontWeight: "bold",
		color: "purple",
	},
	div: {
		fontFamily: "monospace",
	},
	p: {
		fontSize: 30,
	},
	container: {
		flex: 1,
		backgroundColor: "#f6f8f9",
	},
	editor: {
		borderColor: "black",
		borderWidth: 1,
	},
	rich: {
		flex: 1,
	},
	richBar: {
		backgroundColor: "white",
	},
	text: {
		fontWeight: "bold",
		fontSize: 20,
		padding: 15,
	},
	tib: {
		textAlign: "center",
		color: "#515156",
	},
});
