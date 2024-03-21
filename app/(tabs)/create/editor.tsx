import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Poster, RichTextEditor } from "../../../components";
import { useLocalSearchParams } from "expo-router";
import { useWritingsStore } from "../../../store";

const editor = () => {
	const { title } = useLocalSearchParams();
	const { articles } = useWritingsStore();
	const existingArticle = articles.find((article) => article.title === title);
	const [article, setArticle] = useState(
		existingArticle ? existingArticle.content : ""
	);
	const [img, setImg] = useState(existingArticle ? existingArticle.img : "");
	const [Articletitle, setTitle] = useState(
		existingArticle ? existingArticle.title : ""
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
					article={article}
					setShowEditor={setShowEditor}
					title={Articletitle}
					setTitle={setTitle}
					img={img}
					setImg={setImg}
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
