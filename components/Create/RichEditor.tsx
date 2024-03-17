import React, { useRef, useState } from "react";
import { StyleSheet, Text, ScrollView, Button } from "react-native";
import {
	actions,
	RichEditor,
	RichToolbar,
} from "react-native-pell-rich-editor";
import HTMLView from "react-native-htmlview";

const RichTextEditor = () => {
	const RichText = useRef<RichEditor>(null);
	const [article, setArticle] = useState("");
	const [showPreview, setShowPreview] = useState(false);

	function onPressAddImage() {
		RichText.current?.insertImage(
			"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png"
		);
	}

	return (
		<ScrollView style={styles.container}>
			{showPreview ? (
				<>
					<Text style={styles.text}>Preview</Text>
					<HTMLView value={article} stylesheet={styles} />
				</>
			) : (
				<>
					<Text style={styles.text}>Editor</Text>
					<RichEditor
						containerStyle={styles.editor}
						ref={RichText}
						style={styles.rich}
						placeholder={"Start Writing Here"}
						onChange={(text) => setArticle(text)}
					/>
					<RichToolbar
						style={[styles.richBar]}
						editor={RichText}
						disabled={false}
						iconTint={"gray"}
						selectedIconTint={"black"}
						disabledIconTint={"darkgrey"}
						onPressAddImage={onPressAddImage}
						actions={[
							actions.setStrikethrough,
							actions.heading1,
							actions.insertImage,
							actions.setUnderline,
							actions.heading2,
							actions.heading3,
							actions.heading4,
							actions.heading5,
							actions.heading6,
							actions.setParagraph,
							actions.alignLeft,
							actions.alignCenter,
							actions.alignRight,
							actions.alignFull,
							actions.setSubscript,
							actions.setSuperscript,
							actions.setBold,
							actions.setItalic,
							actions.insertBulletsList,
							actions.insertOrderedList,
							actions.undo,
							actions.redo,
							actions.removeFormat,
							actions.blockquote,
						]}
						// map icons for self made actions
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
				</>
			)}
			<Button
				title={showPreview ? "Show Editor" : "Show Preview"}
				onPress={() => setShowPreview(!showPreview)}
			/>
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
		paddingTop: 10,
		paddingBottom: 10,
	},
	editor: {
		backgroundColor: "black",
		borderColor: "black",
		borderWidth: 1,
	},
	rich: {
		flex: 1,
	},
	richBar: {
		height: 50,
		backgroundColor: "#F5FCFF",
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
