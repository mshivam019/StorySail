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

// Toast style configurations extracted to a separate object
const toastStyleConfigs = {
	success: {
		containerStyle: styles => styles.successToastContainer,
		textStyle: styles => styles.successToastText,
		iconColor: "#1f8722",
		iconName: "checkcircleo",
	},
	warning: {
		containerStyle: styles => styles.warningToastContainer,
		textStyle: styles => styles.warningToastText,
		iconColor: "#f08135",
		iconName: "exclamationcircleo",
	},
	error: {
		containerStyle: styles => styles.errorToastContainer,
		textStyle: styles => styles.errorToastText,
		iconColor: "#d9100a",
		iconName: "closecircleo",
	},
};

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

	const dismissToast = useCallback(() => {
		toastsideAnimation.value = withSpring(0);
		setShowing(false);
	}, [toastsideAnimation]);

	const handleGesture = useCallback(
		(event: {
			nativeEvent: { translationX: number; translationY: number };
		}) => {
			const { translationX, translationY } = event.nativeEvent;
			
			if (Math.abs(translationX) > 100 || Math.abs(translationY) > 100) {
				const direction = Math.abs(translationX) > 100 ? translationX : translationY;
				toastsideAnimation.value = withSpring(
					direction > 0 ? 500 : -500,
					{ velocity: 50 }
				);

				setTimeout(() => {
					runOnJS(dismissToast)();
				}, 500);
			}
		},
		[dismissToast]
	);

	if (!showing) return null;

	// Get toast style configuration based on toast type
	const styleConfig = toastStyleConfigs[toastType];

	return (
		<PanGestureHandler onGestureEvent={handleGesture}>
			<Animated.View
				style={[
					styles.toastContainer,
					styleConfig.containerStyle(styles),
					animatedTopStyles,
				]}
			>
				<AntDesign name={styleConfig.iconName} size={24} color={styleConfig.iconColor} />
				<Text style={[styles.toastText, styleConfig.textStyle(styles)]}>
					{toastText}
				</Text>
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