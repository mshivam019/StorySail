import React, { ReactElement } from "react";
import Animated, {
	useAnimatedRef,
	useAnimatedScrollHandler,
	useSharedValue,
} from "react-native-reanimated";

import Item from "./Item";
import { COL, Positions, SIZE } from "./Config";

interface ListProps {
	children: ReactElement<{ id: string }>[];
	editing: boolean;
	onDragEnd: (diff: Positions) => void;
  length: number;
}

function List({ children, editing, onDragEnd,length }: ListProps) {
	const scrollY = useSharedValue(0);
	const scrollView = useAnimatedRef<Animated.ScrollView>();
	const positions = useSharedValue<Positions>( Object.assign(
					{},
					...children.map((child, index) => ({
						[child.props.id]: index,
					}))
			  )
	);
	const onScroll = useAnimatedScrollHandler({
		onScroll: ({ contentOffset: { y } }) => {
			scrollY.value = y;
		},
	});

	return (
		<Animated.ScrollView
			onScroll={onScroll}
			ref={scrollView}
			contentContainerStyle={{
				height: Math.ceil(children.length / COL) * SIZE,
			}}
			showsVerticalScrollIndicator={false}
			bounces={false}
      key={length}
			scrollEventThrottle={16}
		>
			{children.map((child) => (
					<Item
						key={child.props.id}
						positions={positions}
						id={child.props.id}
						editing={editing}
						onDragEnd={onDragEnd}
						scrollView={scrollView}
						scrollY={scrollY}
					>
						{child}
					</Item>
				))}
		</Animated.ScrollView>
	);
}

export default List;
