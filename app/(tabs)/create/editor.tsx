import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Poster, RichTextEditor } from "../../../components";
import { useLocalSearchParams } from "expo-router";
import { useWritingsStore } from "../../../store";
import uuid from "react-native-uuid";

const editor = () => {
	const { id } = useLocalSearchParams<{id:string}>();
	const { articles, drafts } = useWritingsStore();
	const existingArticle =
		articles.find((article) => article.id === id) ||
		drafts.find((article) => article.id === id);
	const [article, setArticle] = useState(
		existingArticle ? existingArticle.content : ""
	);

	const [showEditor, setShowEditor] = useState(true);
	const nextHandler = () => {
		setShowEditor(false);
	};
	return (
		<ScrollView style={styles.container}>
			{showEditor ? (
				<RichTextEditor
					article={article}
					setArticle={setArticle}
					nextHandler={nextHandler}
				/>
			) : (
				<Poster
					setShowEditor={setShowEditor}
					article={
						existingArticle
							? existingArticle
							: {
									id: uuid.v4().toString(),
									title: "",
									content: article,
									category: "",
									tags: [],
									poster_image_url: "",
									stars_count: 0,
									user_id: "1",
									created_at: new Date(),
									updated_at: new Date(),
							  }
					}
				/>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		backgroundColor: "white",
	},
});

export default editor;
