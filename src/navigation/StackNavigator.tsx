import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen'
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator(){
  return(
      <Stack.Navigator initialRouteName="AuthLoadingScreen" screenOptions={{ headerShown: false }}>
         <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} />
        <Stack.Screen name='LoginScreen' component={LoginScreen}/>
        <Stack.Screen name='HomeScreen' component={HomeScreen}/>
      </Stack.Navigator>
  )
}