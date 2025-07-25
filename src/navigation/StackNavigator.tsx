import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen'
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import ProfileScreen from '../screens/KBRIndentScreen';
import KBRIndentScreen from '../screens/KBRIndentScreen';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

export default function StackNavigator(){
  return(
      <Stack.Navigator initialRouteName="AuthLoadingScreen">
         <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} />
        <Stack.Screen name='LoginScreen' component={LoginScreen}/>
              <Stack.Screen name="MainApp" component={DrawerNavigator} />

        {/* <Stack.Screen name='HomeScreen' component={HomeScreen}/>
        <Stack.Screen name='KBRIndentScreen' component={KBRIndentScreen}/> */}

      </Stack.Navigator>
  )
}