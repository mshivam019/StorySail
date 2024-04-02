import {
	StyleSheet,
	Text,
	View,
	FlatList,
	Pressable,
	ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";

const Search = ({ value }: { value: string }) => {
	const debounce = (func: any, wait: number) => {
		let timeout: any;
		return function (this: any, ...args: any) {
			const context: any = this;
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				func.apply(context, args);
			}, wait);
		};
	};
	const [books, setBooks] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	//perform search based on title using like operator
	const fetchBooks = async (value: string) => {
		try {
			const { data, error } = await supabase
				.from("user_writings")
				.select("title,poster_image_url,id")
				.or(`title.ilike.%${value}%, tags.cs.{${value}}`)
				.order("stars_count", { ascending: false });
				

			if (error) console.log("error", error);
			if (data && data?.length > 0) {
				setBooks(data);
			}
		} catch (error) {
			console.log("error", error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		const debounced = debounce(fetchBooks, 1000);
		debounced(value);
	}, [value]);

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<ActivityIndicator size="large" color="#000" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{books.length > 0 ? (
				<FlatList
					data={books}
					contentContainerStyle={{
						paddingBottom: 10,
						gap: 15,
					}}
					renderItem={({ item }) => (
						<Pressable
							style={styles.categoriesContainer}
							onPress={() => router.navigate(`/home/${item.id}`)}
						>
							<View
								style={{
									width: 100,
									height: 100,
									margin: 10,
								}}
							>
								<Image
									source={item.poster_image_url}
									style={{
										width: "100%",
										height: "100%",
										borderRadius: 10,
									}}
								/>
							</View>
							<Text style={styles.ImageText}>{item.title}</Text>
						</Pressable>
					)}
					keyExtractor={(item) => item.title}
					showsVerticalScrollIndicator={false}
				/>
			) : (
				<Text
					style={{
						fontSize: 20,
						textAlign: "center",
						marginTop: 20,
					}}
				>
					No results found
				</Text>
			)}
		</View>
	);
};

export default Search;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fcfffd",
		paddingTop: 20,
		width: "100%",
	},
	categoriesContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		width: "100%",
		borderRadius: 10,
		backgroundColor: "#ebebeb",
	},
	ImageText: {
		fontSize: 16,
		fontWeight: "500",
		color: "#000",
		flexWrap: "wrap",
		width: "60%",
	},
});
