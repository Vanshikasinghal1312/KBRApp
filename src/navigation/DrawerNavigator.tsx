import React, { useState } from 'react';
import { Text, TouchableOpacity, Image, View ,ImageBackground} from 'react-native';
import {createDrawerNavigator,DrawerContentScrollView,} from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import KBRIndentScreen from '../screens/KBRIndentScreen';
import AvailiableIndents from '../screens/AvaliableIndents';
import AdminApproval from '../screens/AdminApproval';
import VehicleApprovalScreen from '../screens/VehicleApproval';
import THCApprovalScreen from '../screens/THCApproval';
import BHCApprovalScreen from '../screens/BHCApproval';
import VehiclePlacementScreen from '../screens/VehiclePlacement';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale } from 'react-native-size-matters';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const Drawer = createDrawerNavigator();

const CustomDrawer = (props) => {
  const [adminExpanded, setAdminExpanded] = useState(false);
  const toggleAdmin = () => setAdminExpanded(!adminExpanded);
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
    <View>
  {/* Logo Banner Container */}
  <View style={{
    marginLeft: wp('10%'),
    width: '90%',
    marginBottom: hp('1%')
  }}>
    <ImageBackground
      source={require('../assets/image/img_kbr.png')}
      style={{
        width: '85%',
        height: hp('7%'),
        justifyContent: 'center',
        alignItems: 'center',
      }}
      resizeMode="cover"
    >
      {/* You can place text/logo overlay here if needed */}
    </ImageBackground>

    {/* Custom Bottom Border Line */}
    <View style={{
      height: 1,
      backgroundColor: 'white',
      width: '90%',         // Make the line shorter
      marginLeft: wp('0.01%'), // Start a little from the left
      marginTop: hp('1.5%'),
    }} />
  </View>
</View>

      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.drawerItem1}>
        <Icon name="home-outline" size={22} color="white" style={styles.icon} />
        <Text style={styles.drawerText}>Dashboard</Text>
      </TouchableOpacity>
<View style={{borderColor: '#87CEEB',backgroundColor:'#0079c0',borderRadius: wp('2.5%'), paddingHorizontal: wp('10%'), paddingVertical: hp('0.7%'),alignSelf: 'flex-start',marginLeft: wp('4%'),marginTop: hp('1.2%'), marginBottom: hp('0.1%')}}>
  <Text style={{ color: '#fefeff', fontSize: moderateScale(14),fontWeight: '700'}}>Operations Team</Text>
</View>
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
          {/* <TouchableOpacity onPress={() => navigation.navigate('BFC Approval')} style={styles.subItem}>
            <Icon name="cube-outline" size={18} color="white" style={styles.icon} />
            <Text style={styles.drawerText}>BFC Approval</Text>
          </TouchableOpacity> */}
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
  logo: {width: wp('85%'),height:hp('7.3%')},
  drawerItem: {flexDirection: 'row',alignItems: 'center',paddingVertical:hp('1.5%'),paddingLeft:wp('12.5%'),},
    drawerItem1: {flexDirection: 'row',alignItems: 'center',paddingVertical:hp('1.5%'),paddingLeft:wp('12.5%'), marginTop:hp('0.5%'),},

  subMenu: {paddingLeft:wp('10%')},
  subItem: {flexDirection: 'row',alignItems: 'center',paddingVertical:hp('1.2%'), paddingLeft:wp('10%')},
  icon: {marginRight: wp('2.5%')},
  drawerText: {color: 'white',fontSize: hp('1.7%'),fontWeight: 'bold',},
};

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerStyle: { backgroundColor: '#00457c', width:wp('75%')},
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: 'white',
      }}
    >
      <Drawer.Screen
        name="Dashboard"
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
      <Drawer.Screen name="Vehicle Approval" component={VehicleApprovalScreen} options={{ drawerItemStyle:{display: 'none' },headerStyle:{backgroundColor: '#00457c' },headerTintColor:'white'}} />
      <Drawer.Screen name="THC Approval" component={THCApprovalScreen} options={{ drawerItemStyle: { display: 'none' },headerStyle:{backgroundColor: '#00457c' },headerTintColor:'white'}} />
      {/* <Drawer.Screen name="BFC Approval" component={BHCApprovalScreen} options={{ drawerItemStyle: { display: 'none' } }} /> */}

      <Drawer.Screen name="Vehicle Placement" component={VehiclePlacementScreen} options={{drawerIcon: ({ color, size }) => 
        <Icon name="cube-outline" size={size} color={color} />,
          headerStyle: { backgroundColor: '#00457c' },headerTintColor: 'white',
        }}
      />
    </Drawer.Navigator>
  );
}
