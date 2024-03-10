import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '../../provider/AuthProvider';
import { Push } from '../../components';


const notifications = () => {
  const { session = null } = useAuth();
  return (
    <View style={{flex:1}}>
      <Text>notifications</Text>
      <Push session={session} />
    </View>
  )
}

export default notifications