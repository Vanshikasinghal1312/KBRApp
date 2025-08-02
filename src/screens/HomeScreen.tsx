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
      <TouchableOpacity onPress={handleLogout} style={{  marginRight:wp('5%'),  backgroundColor: 'white',
    padding:verticalScale(6) ,
     marginHorizontal: scale(80),
  borderRadius: scale(100),
    alignItems: 'center', }}>
        <Text style={{ color: 'navy', fontSize: moderateScale(10), fontWeight:'bold'}}>Logout</Text>
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
    navigation.replace('Login Screen');
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
    source={require('../assets/image/login_Image.png')}
    resizeMode='cover'>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontSize:moderateScale(35), fontStyle: 'italic',marginTop:hp('6%'),fontWeight: 'bold',color: 'white',alignItems:'center', textAlign:'center'}}>Welcome Back! </Text>

        <Text style={{ fontSize:moderateScale(32),fontStyle: 'italic',fontWeight: 'bold',color: 'white',alignItems:'center', textAlign:'center'}}>{userData.firstname}👋</Text>
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
});
