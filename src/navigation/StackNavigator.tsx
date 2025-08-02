import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import DrawerNavigator from './DrawerNavigator';
import CreateNewIndent from '../screens/Create New Indent'
import THCWebViewScreen from '../screens/THCwebviewScreen';
import PlaceVehicleForm from '../screens/PlaceVehicleForm'

const Stack = createNativeStackNavigator();

export default function StackNavigator(){
  return(
      <Stack.Navigator initialRouteName="AuthLoadingScreen" >
        <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Login Screen' component={LoginScreen} options={{headerStyle: {backgroundColor: 'navy'},headerTintColor: 'white',headerShown: false}} />
        <Stack.Screen name="MainApp" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Create New Indent" component={CreateNewIndent} options={{headerStyle: {backgroundColor: 'navy'},headerTintColor: 'white',}}  />
        <Stack.Screen name="THC View" component={THCWebViewScreen} options={{ title: 'View THC Details' }} />      
        <Stack.Screen name="Place VehicleForm" component={PlaceVehicleForm} />

      </Stack.Navigator>
  )
}