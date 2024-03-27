import React from "react";

import { MARGIN } from "./Config";
import Tile from "./Tile";
import SortableList from "./SortableList";
import { ScrollView } from "react-native";

const data = [
	{
		id: "1",
		title: "The art of war",
		image: "https://random.imagecdn.app/500/150",
	},
	{
		id: "2",
		title: "The Alchemist",
		image: "https://random.imagecdn.app/500/150",
	},
	{
		id: "3",
		title: "The Great Gatsby",
		image: "https://random.imagecdn.app/500/150",
	},
	{
		id: "4",
		title: "The Catcher in the Rye",
		image: "https://random.imagecdn.app/500/150",
	},
	{
		id: "5",
		title: "The Hobbit",
		image: "https://random.imagecdn.app/500/150",
	},
	{
		id: "6",
		title: "The Hitchhiker's Guide to the Galaxy",
		image: "https://random.imagecdn.app/500/150",
	},
	{
		id: "7",
		title: "The Da Vinci Code",
		image: "https://random.imagecdn.app/500/150",
	},
	{
		id: "8",
		title: "The Shining",
		image: "https://random.imagecdn.app/500/150",
	},
	{
		id: "9",
		title: "The 300 Spartans",
		image: "https://random.imagecdn.app/500/150",
	},
	{
		id: "10",
		title: "The Lord of the Rings",
		image: "https://random.imagecdn.app/500/150",
	},
	{
		id: "11",
		title: "The Hunger Games",
		image: "https://random.imagecdn.app/500/150",
	},
];

const WidgetList = () => {
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			style={{
				paddingHorizontal: MARGIN,
				marginTop: 20,
				flex: 1,
			}}
		>
			<SortableList
				editing={true}
				length={data.length}
				onDragEnd={(positions) => console.log(positions)}
			>
				{[...data].map((tile, index) => (
					<Tile
						onLongPress={() => true}
						key={tile.id + "-" + index}
						card={tile}
						id={tile.id}
					/>
				))}
			</SortableList>
		</ScrollView>
	);
};

export default WidgetList;
