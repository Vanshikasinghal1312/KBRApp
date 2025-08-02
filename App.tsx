import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator'

export default function App(){
 return (
<SafeAreaView style={{flex:1}}> 
     <NavigationContainer>
      <StackNavigator />
     </NavigationContainer>
   </SafeAreaView>
  )
}
