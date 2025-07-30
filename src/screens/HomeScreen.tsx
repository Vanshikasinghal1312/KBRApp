import React, { useEffect, useState , useLayoutEffect} from 'react';
import {View,Text,TouchableOpacity,StyleSheet,ScrollView,ActivityIndicator, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);


  useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity onPress={handleLogout} style={{  marginRight:15,  backgroundColor: 'white',
    padding:8,
    marginHorizontal:90,
    borderRadius:100, 
    alignItems: 'center', }}>
        <Text style={{ color: 'navy', fontSize: 12, fontWeight:'800'}}>Logout</Text>
      </TouchableOpacity>
    ),
  });
}, [navigation]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        } else {
          navigation.replace('Login Screen');
        }
      } catch (error) {
        console.log('❌ Error loading user data:', error);
        navigation.replace('Login Screen');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData');
    navigation.replace('LoginScreen');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="navy" />
      </View>
    );
  }

  if (!userData) return null;

  return (
    <ImageBackground 
    style={{  flex:1,
    }}
    source={require('../assets/image/truck2.png')}
    resizeMode='cover'>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontSize:moderateScale(30),marginTop:60,fontWeight: 'bold',color: 'navy',marginLeft:wp('30%'),marginRight:wp('1%')}}>Welcome Back! </Text>

        <Text style={{ fontSize:moderateScale(28),fontWeight: 'bold',color: 'navy',marginLeft:wp('40%'),marginRight:wp('1%')}}>{userData.firstname}👋</Text>
    </ScrollView>
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#444',
    fontWeight: '600',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  logoutButton: {
    backgroundColor: 'navy',
    padding: 14,
    marginHorizontal:90,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
