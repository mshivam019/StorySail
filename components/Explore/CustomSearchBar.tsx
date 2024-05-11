import React, {
	useCallback,
	useRef,
	useMemo,
	useImperativeHandle,
} from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	TextInputProps,
	StyleProp,
	ViewStyle,
	TextStyle,
	LayoutChangeEvent,
	useWindowDimensions,
	Platform,
	Dimensions,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	Easing,
	withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const IS_ANDROID = Platform.OS === "android";

export const springConfig = {
	stiffness: 1000,
	damping: 500,
	mass: 3,
	overshootClamping: true,
	restDisplacementThreshold: 0.01,
	restSpeedThreshold: 0.01,
};

export const timingConfig = {
	duration: 250,
	easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

const hitSlop = {
	top: 8,
	bottom: 8,
	left: 8,
	right: 8,
};

const TextInputTheme = {
	dark: {
		backgroundColor: "transparent",
		placeholderColor: "#636366",
		textInputBackground: "rgba(44,44,46,0.8)",
		textColor: "white",
		selectionColor: "#2979ff",
		clearIconColor: "#c7c7cc",
		searchIconColor: "#b0b0b2",
		textButtonColor: "#2979ff",
	},
	light: {
		backgroundColor: "transparent",
		placeholderColor: "#8e8e93",
		textInputBackground: "#fff",
		textColor: "black",
		selectionColor: "#2979ff",
		clearIconColor: "#c7c7cc",
		searchIconColor: "#8e8e93",
		textButtonColor: "#2979ff",
	},
};

type CustomTextInputProps = Omit<TextInputProps, "clearButtonMode" | "style">;

export type InputThemeType = {
	backgroundColor?: string;
	placeholderColor?: string;
	textInputBackground?: string;
	textColor?: string;
	selectionColor?: string;
	clearIconColor?: string;
	searchIconColor?: string;
	textButtonColor?: string;
};

interface SearchBarProps extends CustomTextInputProps {
	containerStyle?: StyleProp<ViewStyle>;
	width?: number | string;
	height?: number;
	borderRadius?: number;
	textInputStyle?: StyleProp<TextStyle>;
	cancelButton?: boolean;
	cancelTitle?: string;
	cancelTitleStyle?: StyleProp<TextStyle>;
	theme?: InputThemeType;
	isDarkTheme?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	onSubmitEditing?: () => void;
	onChangeText?: (value: string) => void;
	clearIcon?: React.ReactNode;
	searchIcon?: React.ReactNode;
}

function SearchBarComponent(props: SearchBarProps, ref: React.Ref<any>) {
	const {
		containerStyle,
		width,
		height,
		borderRadius,
		textInputStyle,
		cancelButton,
		cancelTitle,
		cancelTitleStyle,
		theme,
		isDarkTheme,
		onFocus,
		onBlur,
		onSubmitEditing,
		onChangeText,
		clearIcon,
		searchIcon,
		...otherProps
	} = props;
	const refInput = useRef<TextInput>(null);
	const isFocus = useSharedValue(false);
	const clearButton = useSharedValue((props.value?.length as number) > 0);
	const cancelButtonWidth = useSharedValue(40);
	const dimensions = useWindowDimensions();

	const themeStyle = useMemo(
		() => ({
			...(isDarkTheme ? TextInputTheme.dark : TextInputTheme.light),
			...theme,
		}),
		[theme, isDarkTheme]
	);

	const onCancel = useCallback(() => {
		refInput.current?.blur();
		refInput.current?.clear();
		onChangeText?.("");
	}, [refInput]);

	const onCancelLayout = useCallback(
		(event: LayoutChangeEvent) => {
			cancelButtonWidth.value = event.nativeEvent.layout.width;
		},
		[cancelButtonWidth]
	);

	const onClear = useCallback(() => {
		refInput.current?.clear();
		clearButton.value = false;
		onChangeText?.("");
	}, [refInput, clearButton, onChangeText]);

	const onTextInputFocus = useCallback(() => {
		isFocus.value = true;
		onFocus?.();
	}, [isFocus, onFocus]);

	const onTextInputBlur = useCallback(() => {
		isFocus.value = false;
		onBlur?.();
	}, [isFocus, onBlur]);

	const onTextInputSubmitEditing = useCallback(() => {
		isFocus.value = false;
		onSubmitEditing?.();
	}, [isFocus, onSubmitEditing]);

	const onChangeTextInput = useCallback(
		(text: string) => {
			onChangeText?.(text);
			if (text.length > 0) {
				clearButton.value = true;
			} else {
				clearButton.value = false;
			}
		},
		[clearButton, onChangeText]
	);

	useImperativeHandle(ref, () => ({
		clear: () => {
			onClear();
		},
		focus: () => {
			refInput.current?.focus();
		},
		blur: () => {
			refInput.current?.blur();
		},
	}));

	const inputStyle = useAnimatedStyle(() => {
		if (!cancelButton) {
			return {};
		}

		return {
			marginRight: withSpring(
				isFocus.value ? cancelButtonWidth.value + 8 : 0,
				springConfig
			),
		};
	});

	const clearButtonStyle = useAnimatedStyle(() => {
		const isShowClearButton = isFocus.value && clearButton.value;

		return {
			opacity: withTiming(isShowClearButton ? 1 : 0, timingConfig),
			transform: [
				{ scale: withTiming(isShowClearButton ? 1 : 0, timingConfig) },
			],
		};
	});

	const textStyle = useAnimatedStyle(() => ({
			opacity: withTiming(isFocus.value ? 1 : 0, timingConfig),
			transform: [
				{ scale: withTiming(isFocus.value ? 1 : 0, timingConfig) },
				{
					translateX: isFocus.value
						? withTiming(0, { duration: 0 })
						: withTiming(dimensions.width, { duration: 650 }),
				},
			],
		}));

	return (
		<View>
			<View style={styles.container}>
				<Animated.View
					style={[
						styles.viewTextInput,
						{
							height,
							borderRadius,
							backgroundColor: themeStyle.textInputBackground,
						},
						inputStyle,
					]}
				>
					<TextInput
						returnKeyType="search"
						autoCorrect={false}
						multiline={false}
						{...otherProps}
						underlineColorAndroid="transparent"
						clearButtonMode="never"
						style={[
							styles.textInput,
							textInputStyle,
							{ color: themeStyle.textColor },
						]}
						placeholderTextColor={themeStyle.placeholderColor}
						selectionColor={themeStyle.selectionColor}
						onFocus={onTextInputFocus}
						onBlur={onTextInputBlur}
						onSubmitEditing={onTextInputSubmitEditing}
						onChangeText={onChangeTextInput}
						ref={refInput}
					/>
					<Animated.View style={[styles.viewClear, clearButtonStyle]}>
						<TouchableOpacity
							style={[
								styles.clearButton,
								{ backgroundColor: themeStyle.clearIconColor },
							]}
							onPress={onClear}
							hitSlop={hitSlop}
						>
							{clearIcon ?? (
								<Ionicons
									name="close"
									color="rgba(0, 0, 0, 0.6)"
									size={14}
								/>
							)}
						</TouchableOpacity>
					</Animated.View>
				</Animated.View>
				<View style={styles.searchIcon}>
					{searchIcon ?? (
						<Ionicons
							name="search"
							color={themeStyle.searchIconColor}
							size={18}
						/>
					)}
				</View>
				{cancelButton && (
					<Animated.View style={[styles.viewCancelButton, textStyle]}>
						<TouchableOpacity
							hitSlop={hitSlop}
							onPress={onCancel}
							onLayout={onCancelLayout}
						>
							<Text
								style={[
									styles.cancel,
									{ color: themeStyle.textButtonColor },
									cancelTitleStyle,
								]}
							>
								{cancelTitle}
							</Text>
						</TouchableOpacity>
					</Animated.View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
	},
	viewTextInput: {
		flex: 1,
		justifyContent: "center",
		paddingRight: 30,
		paddingLeft: 32,
	},
	textInput: {
		fontSize: 17,
		fontWeight: "400",
		lineHeight: 20,
		letterSpacing: 0.5,
		textAlignVertical: "center",
		padding: 0,
		margin: 0,
		paddingBottom: IS_ANDROID ? 2 : 0,
	},
	searchIcon: {
		position: "absolute",
		paddingLeft: 8,
	},
	viewClear: {
		position: "absolute",
		right: 8,
	},
	clearButton: {
		backgroundColor: "#C7C7CC",
		width: 16,
		height: 16,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	viewCancelButton: {
		position: "absolute",
		right: 0,
	},
	cancel: {
		fontSize: 17,
		fontWeight: "500",
	},
});

const SearchBar = React.forwardRef(SearchBarComponent);

SearchBar.defaultProps = {
	height: 40,
	borderRadius: 12,
	cancelButton: true,
	cancelTitle: "Cancel",
	isDarkTheme: false,
};

export default React.memo(SearchBar);
