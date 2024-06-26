import { StyleSheet, Text, Platform } from "react-native";
import React, {
	useState,
	useCallback,
	useImperativeHandle,
	forwardRef,
	RefObject,
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
import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";

export interface ToastRef {
	show: (config: {
		type: "success" | "warning" | "error";
		text: string;
		duration: number;
	}) => void;
}

const Toast = forwardRef<ToastRef, {}>((props, ref) => {
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
		ref as RefObject<ToastRef> | null,
		() => ({
			show,
		}),
		[show]
	);

	const animatedTopStyles = useAnimatedStyle(() => ({
		top: toastTopAnimation.value,
		left: toastsideAnimation.value,
		right: toastsideAnimation.value,
	}));

	const handleGesture = useCallback(
		(event: {
			nativeEvent: { translationX: number; translationY: number };
		}) => {
			const { translationX, translationY } = event.nativeEvent;
			const isHorizontalSwipe = Math.abs(translationX) > 100;
			const isVerticalSwipe = Math.abs(translationY) > 100;

			if (isHorizontalSwipe || isVerticalSwipe) {
				const direction = isHorizontalSwipe
					? translationX
					: translationY;
				toastsideAnimation.value = withSpring(
					direction > 0 ? 500 : -500,
					{ velocity: 50 }
				);

				setTimeout(() => {
					toastsideAnimation.value = withSpring(0);
					setShowing(false);
				}, 500);
			}
		},
		[]
	);

	const getToastStyles = (type: "success" | "warning" | "error") => {
		switch (type) {
			case "success":
				return [
					styles.successToastContainer,
					styles.successToastText,
					"#1f8722",
					"checkcircleo",
				];
			case "warning":
				return [
					styles.warningToastContainer,
					styles.warningToastText,
					"#f08135",
					"exclamationcircleo",
				];
			case "error":
			default:
				return [
					styles.errorToastContainer,
					styles.errorToastText,
					"#d9100a",
					"closecircleo",
				];
		}
	};

	if (!showing) return null;

	const [containerStyle, textStyle, iconColor, iconName] =
		getToastStyles(toastType);

	return (
		<PanGestureHandler onGestureEvent={handleGesture}>
			<Animated.View
				style={[
					styles.toastContainer,
					containerStyle,
					animatedTopStyles,
				]}
			>
				<AntDesign name={iconName} size={24} color={iconColor} />
				<Text style={[styles.toastText, textStyle]}>{toastText}</Text>
			</Animated.View>
		</PanGestureHandler>
	);
});

Toast.displayName = "Toast";

export default Toast;

const styles = StyleSheet.create({
	toastContainer: {
		position: "absolute",
		top: 0,
		width: "100%",
		padding: 10,
		borderRadius: 18,
		minWidth: WINDOW_WIDTH * 0.89,
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
