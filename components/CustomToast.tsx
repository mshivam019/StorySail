import {  StyleSheet, Text, Platform } from "react-native";
import React, {
	useState,
	useCallback,
	useImperativeHandle,
	forwardRef,
} from "react";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSequence,
	withDelay,
	withTiming,
	withSpring,
	runOnJS,
} from "react-native-reanimated";
import {AntDesign} from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface ToastProps {
	// Add any additional props if needed
}

export interface ToastRef {
	show: (config: {
		type: "success" | "warning" | "error";
		text: string;
		duration: number;
	}) => void;
}
const Toast = forwardRef<ToastRef, ToastProps>(({}, ref) => {
	const toastTopAnimation = useSharedValue(-100);
	const context = useSharedValue(0);
	const [showing, setShowing] = useState(false);
	const [toastType, setToastType] = useState("success");
	const [toastText, setToastText] = useState("");
	const [toastDuration, setToastDuration] = useState(0);
	// If you're not using react-native-bars, please use the one below by uncommenting it
	// const TOP_VALUE = 60;
	const TOP_VALUE = Platform.OS === "ios" ? 60 : 30;
	const show = useCallback(
		({
			type,
			text,
			duration,
		}: {
			type: "success" | "warning" | "error";
			text: string;
			duration: number;
		}) => {
			setShowing(true);
			setToastType(type);
			setToastText(text);
			setToastDuration(duration);
			toastTopAnimation.value = withSequence(
				withTiming(TOP_VALUE),
				withDelay(
					duration,
					withTiming(-100, undefined, (finish) => {
						if (finish) {
							runOnJS(setShowing)(false);
						}
					})
				)
			);
		},
		[TOP_VALUE, toastTopAnimation]
	);
	useImperativeHandle(
		ref,
		() => ({
			show,
		}),
		[show]
	);

	const animatedTopStyles = useAnimatedStyle(() => {
		return {
			top: toastTopAnimation.value,
		};
	});

	const pan = Gesture.Pan()
		.onBegin(() => {
			context.value = toastTopAnimation.value;
		})
		.onUpdate((event) => {
			if (event.translationY < 100) {
				toastTopAnimation.value = withSpring(
					context.value + event.translationY,
					{
						damping: 600,
						stiffness: 100,
					}
				);
			}
		})
		.onEnd((event) => {
			if (event.translationY < 0) {
				toastTopAnimation.value = withTiming(
					-100,
					undefined,
					(finish) => {
						if (finish) {
							runOnJS(setShowing)(false);
						}
					}
				);
			} else if (event.translationY > 0) {
				toastTopAnimation.value = withSequence(
					withTiming(TOP_VALUE),
					withDelay(
						toastDuration,
						withTiming(-100, undefined, (finish) => {
							if (finish) {
								runOnJS(setShowing)(false);
							}
						})
					)
				);
			}
		});

	return (
		<>
			{showing && (
				<GestureDetector gesture={pan}>
					<Animated.View
						style={[
							styles.toastContainer,
							toastType === "success"
								? styles.successToastContainer
								: toastType === "warning"
								? styles.warningToastContainer
								: styles.errorToastContainer,
							animatedTopStyles,
						]}
					>
						{
							toastType === "success"
							? <AntDesign name="checkcircleo" size={24} color="#1f8722" />
							: toastType === "warning"
							? <AntDesign name="exclamationcircleo" size={24} color="#f08135" />
							: <AntDesign name="closecircleo" size={24} color="#d9100a" />

						}
						<Text
							style={[
								styles.toastText,
								toastType === "success"
									? styles.successToastText
									: toastType === "warning"
									? styles.warningToastText
									: styles.errorToastText,
							]}
						>
							{toastText}
						</Text>
					</Animated.View>
				</GestureDetector>
			)}
		</>
	);
});

export default Toast;

const styles = StyleSheet.create({
	toastContainer: {
		position: "absolute",
		top: 0,
		width: "90%",
		padding: 10,
		borderRadius: 18,
		borderWidth: 1,
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "center",
	},
	toastText: {
		marginLeft: 14,
		fontSize: 16,
	},
	toastIcon: {
		width: 30,
		height: 30,
		resizeMode: "contain",
	},
	successToastContainer: {
		backgroundColor: "#def1d7",
		borderColor: "#1f8722",
	},
	warningToastContainer: {
		backgroundColor: "#fef7ec",
		borderColor: "#f08135",
	},
	errorToastContainer: {
		backgroundColor: "#fae1db",
		borderColor: "#d9100a",
	},
	successToastText: {
		color: "#1f8722",
	},
	warningToastText: {
		color: "#f08135",
	},
	errorToastText: {
		color: "#d9100a",
	},
});
