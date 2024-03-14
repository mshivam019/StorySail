import {  StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { CustomSearchBar } from '../../../components'

const explore = () => {
  return (
    <ScrollView style={styles.container}
    contentContainerStyle={{ paddingHorizontal: 20,marginTop: 20}}
    >
      <CustomSearchBar placeholder='Explore!' />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor:'#fcfffd',
  }
})

export default explore