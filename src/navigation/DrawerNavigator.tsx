import React from 'react';
import { Text,TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/AvaliableIndents';
import KBRIndentScreen from '../screens/KBRIndentScreen';
import AvailiableIndents from '../screens/AvaliableIndents';
import AdminApproval from '../screens/AdminApproval';
import VehiclePlacement from '../screens/VehiclePlacement';
import OngoingTrips from '../screens/OngoingTrips';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home Screen"  screenOptions={{
         drawerIcon: ({color, size}) => (
      <MaterialCommunityIcons name="home-outline" size={size} color={color} />
    ),
          drawerStyle: {
            backgroundColor: 'navy', 
            width: 300,              
          },
          drawerActiveTintColor: 'white',
  drawerInactiveTintColor: 'white',
                
        }}>
      <Drawer.Screen name="Home Screen" component={HomeScreen} options={{
    headerStyle: {
      backgroundColor: 'navy',
    },
    headerTintColor: 'white',
  }}
  />
            <Drawer.Screen name="KBR Indents" component={KBRIndentScreen}  options={({ navigation }) => ({
    headerTitle: 'KBR Indents',
    headerStyle: {
      backgroundColor: 'navy',
    },
    headerTintColor: 'white',
    
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('Create New Indent')} // adjust your screen name
        style={{ marginRight: 15 }}
      >
        <Text style={{ fontSize: 24, color: 'navy' }}>＋</Text>
      </TouchableOpacity>
    ),
  })} 
  
  />
            <Drawer.Screen name="Avaliable Indents" component={AvailiableIndents} options={{
    headerStyle: {
      backgroundColor: 'navy',
    },
    headerTintColor: 'white',
  }} />
            <Drawer.Screen name="Admin Approval" component={AdminApproval} options={{
    headerStyle: {
      backgroundColor: 'navy',
    },
    headerTintColor: 'white',
  }} />
            <Drawer.Screen name="Vehicle Placement" component={VehiclePlacement} options={{
    headerStyle: {
      backgroundColor: 'navy',
    },
    headerTintColor: 'white',
  }} />
            <Drawer.Screen name="Ongoing Trips" component={OngoingTrips}options={{
    headerStyle: {
      backgroundColor: 'navy',
    },
    headerTintColor: 'white',
  }}  />

    </Drawer.Navigator>
  );
}
