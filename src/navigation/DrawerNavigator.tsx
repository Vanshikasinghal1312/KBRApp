import React from 'react';
import { Text,TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/AvaliableIndents';
import KBRIndentScreen from '../screens/KBRIndentScreen';
import AvaliableIndents from '../screens/AvaliableIndents';
import AdminApproval from '../screens/AdminApproval';
import VehiclePlacement from '../screens/VehiclePlacement';
import OngoingTrips from '../screens/OngoingTrips';


const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="HomeScreen">
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
            <Drawer.Screen name="KBRIndentScreen" component={KBRIndentScreen}  options={({ navigation }) => ({
    headerTitle: 'KBRIndentScreen',
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateNewIndent')} // adjust your screen name
        style={{ marginRight: 15 }}
      >
        <Text style={{ fontSize: 24, color: 'navy' }}>＋</Text>
      </TouchableOpacity>
    ),
  })} />
            <Drawer.Screen name="AvaliableIndents" component={AvaliableIndents} />
            <Drawer.Screen name="AdminApproval" component={AdminApproval} />
            <Drawer.Screen name="VehiclePlacement" component={VehiclePlacement} />
            <Drawer.Screen name="OngoingTrips" component={OngoingTrips} />

    </Drawer.Navigator>
  );
}
