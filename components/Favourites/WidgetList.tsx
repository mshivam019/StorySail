import { useState } from "react";

import { ScrollView, ActivityIndicator, View, Text } from "react-native";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MARGIN } from "./SortableList/Config";
import Tile from "./SortableList/Tile";
import SortableList from "./SortableList/SortableList";
import { supabase } from "../../lib/supabase";
import { useUserStore } from "../../store";

function WidgetList() {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const { user } = useUserStore();

	const fetchFavorites = async () => {
		try {
			const { data, error } = await supabase
				.from("stars")
				.select("writing_id")
				.eq("user_id", user?.id);

			if (error) console.log("error", error);
			if (data && data?.length > 0) {
				const content = await supabase
					.from("user_writings")
					.select("id,poster_image_url,title")
					.in(
						"id",
						data.map((d) => d.writing_id)
					);
				if (content.error) console.log("error", content.error);
				if (content.data && content.data?.length > 0) {
					setData(content.data);
				}
			}
		} catch (error) {
			console.log("error", error);
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(() => {
		fetchFavorites();
	});

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#d2f4f9",
				}}
			>
				<ActivityIndicator size="large" color="#000" />
			</View>
		);
	}
	if (data.length === 0) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#d2f4f9",
				}}
			>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold",
						color: "#000",
					}}
				>
					No favorites yet
				</Text>
			</View>
		);
	}
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			style={{
				flex: 1,
				backgroundColor: "#fff",
			}}
			overScrollMode="never"
		>
			<LinearGradient
				colors={["#d2f4f9", "#ffffff"]}
				style={{ flex: 1, paddingTop: 20, paddingHorizontal: MARGIN }}
			>
				<SortableList
					editing
					length={data.length}
					onDragEnd={(positions) => console.log(positions)}
				>
					{[...data].map((tile) => (
						<Tile
							key={tile.id}
							card={tile}
							id={tile.id}
						/>
					))}
				</SortableList>
			</LinearGradient>
		</ScrollView>
	);
}

export default WidgetList;
