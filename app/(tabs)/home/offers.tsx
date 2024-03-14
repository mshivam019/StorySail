import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const offers = () => {
        const {id} = useLocalSearchParams();
    return (
        <View style={styles.container}>
            <Text>offer: {id}</Text>
        </View>
    )
}

export default offers

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})