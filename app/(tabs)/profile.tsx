import React from 'react'
import { View } from 'react-native'
import { Account } from '../../components'
import { useApp } from '../../context/AppContext'

const profile = () => {
    const session = useApp()?.session || null;
  return (
    <View>
      <Account session={session} />
    </View>
  )
}

export default profile