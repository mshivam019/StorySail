import { StyleSheet, Text, Platform } from "react-native";
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
import { AntDesign } from "@expo/vector-icons";
import { PanGestureHandler } from "react-native-gesture-handler";

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
	const toastsideAnimation = useSharedValue(0);
	const [showing, setShowing] = useState(false);
	const [toastType, setToastType] = useState<"success" | "warning" | "error">(
		"success"
	);
	const [toastText, setToastText] = useState("");
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
			left: toastsideAnimation.value,
			right: toastsideAnimation.value,
		};
	});

	const handleGesture = useCallback(
		(event: {
			nativeEvent: { translationX: number; translationY: number };
		}) => {
			if (Math.abs(event.nativeEvent.translationX) > 100) {
				toastsideAnimation.value = withSpring(
					event.nativeEvent.translationX > 0 ? 500 : -500,
					{ velocity: 50 }
				);
			} else if (Math.abs(event.nativeEvent.translationY) > 100) {
				toastsideAnimation.value = withSpring(
					event.nativeEvent.translationY > 0 ? 500 : -500,
					{ velocity: 50 }
				);
			}
			setTimeout(() => {
				toastsideAnimation.value = withSpring(0);
				setShowing(false);
			}, 500);
		},
		[]
	);

	return (
		showing && (
			<PanGestureHandler onGestureEvent={handleGesture}>
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
					{toastType === "success" ? (
						<AntDesign
							name="checkcircleo"
							size={24}
							color="#1f8722"
						/>
					) : toastType === "warning" ? (
						<AntDesign
							name="exclamationcircleo"
							size={24}
							color="#f08135"
						/>
					) : (
						<AntDesign
							name="closecircleo"
							size={24}
							color="#d9100a"
						/>
					)}
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
			</PanGestureHandler>
		)
	);
});

export default Toast;

const styles = StyleSheet.create({
	toastContainer: {
		position: "absolute",
		top: 0,
		width: "100%",
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
