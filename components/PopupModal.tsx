import React, { useEffect } from 'react'
import {
	View,
	TouchableWithoutFeedback,
	Keyboard,
	Modal,
    StyleSheet,
} from 'react-native'
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated'

export interface PopupModalProps {
	isVisible: boolean
	onDismiss: () => void
	children: React.ReactNode
}



const PopupModal: React.FC<PopupModalProps> = ({ children, onDismiss, isVisible }) => {
	const opacity = useSharedValue(0)

	const backdropAnimatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value * 0.6,
	}))

	useEffect(() => {
		opacity.value = withTiming(isVisible ? 1 : 0)
		if (!isVisible) Keyboard.dismiss()
	}, [isVisible])

	if (!isVisible) return null

	return (
		<Modal transparent visible={isVisible}>
			<View style={styles.fullScreen}>
				<TouchableWithoutFeedback onPress={onDismiss}>
					<Animated.View style={[ styles.backdrop, backdropAnimatedStyle]} />
				</TouchableWithoutFeedback>
				{children}
			</View>
		</Modal>
	)
}

const styles =  StyleSheet.create({
    fullScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
})

export default PopupModal