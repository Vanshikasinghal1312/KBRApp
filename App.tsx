import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator'
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/KBRIndentScreen';



export default function App(){

  return (
<SafeAreaView style={{flex:1}}> 
     <NavigationContainer>
      <StackNavigator />
     </NavigationContainer>
   </SafeAreaView>
  )


}
