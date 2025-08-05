import React, { useState } from 'react';
import { Text, TouchableOpacity, Image, View } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import KBRIndentScreen from '../screens/KBRIndentScreen';
import AvailiableIndents from '../screens/AvaliableIndents';
import AdminApproval from '../screens/AdminApproval';
import VehicleApprovalScreen from '../screens/VehicleApproval';
import THCApprovalScreen from '../screens/THCApproval';
import BHCApprovalScreen from '../screens/BHCApproval';
import VehiclePlacementScreen from '../screens/VehiclePlacement';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';

const Drawer = createDrawerNavigator();

const CustomDrawer = (props) => {
  const [adminExpanded, setAdminExpanded] = useState(false);
  const toggleAdmin = () => setAdminExpanded(!adminExpanded);
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/image/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Visible Drawer Items */}
      <TouchableOpacity onPress={() => navigation.navigate('Home Screen')} style={styles.drawerItem}>
        <Icon name="home-outline" size={22} color="white" style={styles.icon} />
        <Text style={styles.drawerText}>Home Screen</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('KBR Indents')} style={styles.drawerItem}>
        <Icon name="cube-outline" size={22} color="white" style={styles.icon} />
        <Text style={styles.drawerText}>KBR Indents</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Avaliable Indents')} style={styles.drawerItem}>
        <Icon name="cube-outline" size={22} color="white" style={styles.icon} />
        <Text style={styles.drawerText}>Available Indents</Text>
      </TouchableOpacity>

      {/* Admin Section */}
      <TouchableOpacity onPress={toggleAdmin} style={styles.drawerItem}>
        <Icon name={adminExpanded ? 'chevron-up' : 'chevron-down'} size={22} color="white" style={styles.icon} />
        <Text style={styles.drawerText}>Admin Approval</Text>
      </TouchableOpacity>

      {adminExpanded && (
        <View style={styles.subMenu}>
          <TouchableOpacity onPress={() => navigation.navigate('Vehicle Approval')} style={styles.subItem}>
            <Icon name="cube-outline" size={18} color="white" style={styles.icon} />
            <Text style={styles.drawerText}>Vehicle Approval</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('THC Approval')} style={styles.subItem}>
            <Icon name="cube-outline" size={18} color="white" style={styles.icon} />
            <Text style={styles.drawerText}>THC Approval</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('BFC Approval')} style={styles.subItem}>
            <Icon name="cube-outline" size={18} color="white" style={styles.icon} />
            <Text style={styles.drawerText}>BFC Approval</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Vehicle Placement')} style={styles.drawerItem}>
        <Icon name="cube-outline" size={22} color="white" style={styles.icon} />
        <Text style={styles.drawerText}>Vehicle Placement</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = {
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 2,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginBottom: 6,
  },
  logo: {
    width: 180,
    height: 60,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 15,
  },
  subMenu: {
    paddingLeft: 40,
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  drawerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
};

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home Screen"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerStyle: { backgroundColor: '#00457c', width: 300 },
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: 'white',
      }}
    >
      <Drawer.Screen
        name="Home Screen"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => <Icon name="home-outline" size={size} color={color} />,
          headerStyle: { backgroundColor: '#00457c' },
          headerTintColor: 'white',
        }}
      />
      <Drawer.Screen
        name="KBR Indents"
        component={KBRIndentScreen}
        options={({ navigation }) => ({
          drawerIcon: ({ color, size }) => <Icon name="cube-outline" size={size} color={color} />,
          headerTitle: 'KBR Indents',
          headerStyle: { backgroundColor: '#00457c' },
          headerTintColor: 'white',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Create New Indent')}
              style={{ marginRight: wp('5%') }}
            >
              <Text style={{ fontSize: moderateScale(26), color: 'white' }}>＋</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="Avaliable Indents" component={AvailiableIndents} options={{
          drawerIcon: ({ color, size }) => <Icon name="cube-outline" size={size} color={color} />,
          headerStyle: { backgroundColor: '#00457c' },
          headerTintColor: 'white',
        }}
      />

      <Drawer.Screen name="Admin Approval" component={AdminApproval} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="Vehicle Approval" component={VehicleApprovalScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="THC Approval" component={THCApprovalScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="BFC Approval" component={BHCApprovalScreen} options={{ drawerItemStyle: { display: 'none' } }} />

      <Drawer.Screen name="Vehicle Placement" component={VehiclePlacementScreen} options={{drawerIcon: ({ color, size }) => 
        <Icon name="cube-outline" size={size} color={color} />,
          headerStyle: { backgroundColor: '#00457c' },headerTintColor: 'white',
        }}
      />
    </Drawer.Navigator>
  );
}
