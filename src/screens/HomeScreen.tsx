import React, { useEffect, useState , useLayoutEffect} from 'react';
import {View,Text,TouchableOpacity,StyleSheet,ScrollView,ActivityIndicator, ImageBackground, TouchableWithoutFeedback,Keyboard, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);


useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <View style={{ marginRight: wp('5%') }}>
        <TouchableOpacity
          onPress={() => setShowMenu(!showMenu)}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ color: 'white', marginRight: 5 }}>{userData?.firstname}</Text>
          <Icon name="account-circle" size={26} color="white" />
          <Icon name="chevron-down" size={20} color="white" />
        </TouchableOpacity>

        {/* Dropdown Menu */}
        {showMenu && (
          <View style={{position: 'absolute',top: hp('4.3%'),               // ~35px
right: 0,                      // Can remain static unless needed responsive
backgroundColor: 'white',
borderRadius: wp('1.5%'),      // ~6px
paddingVertical: hp('0.7%'),   // ~6px
elevation: 5,
zIndex: 999,
width: wp('25%'),}}>
            <TouchableOpacity onPress={handleLogout} style={{paddingVertical: hp('0.2%'),paddingHorizontal: wp('0.5%'),}}>
              <Text style={{fontSize:moderateScale(12),color: 'black',textAlign:'center'}}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    ),
  });
}, [navigation, userData, showMenu]);



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
<TouchableWithoutFeedback onPress={() => {
      if (showMenu) setShowMenu(false);
      Keyboard.dismiss(); 
    }}>
<View style={{ flex: 1 }}>
 <ImageBackground style={{ flex: 1 }} resizeMode='cover' source={require('../assets/image/login_Image.png')}>
  <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
   <Text style={{fontSize: moderateScale(35),fontStyle: 'italic',marginTop: hp('6%'),fontWeight: 'bold',color: 'white',textAlign: 'center'}}>Welcome Back!</Text>
   <Text style={{fontSize: moderateScale(32),fontStyle: 'italic',fontWeight: 'bold',color: 'white',textAlign: 'center'}}>{userData.firstname}👋</Text>
   <View style={{ alignItems: 'center', marginTop: hp('2%') }}>
    <Image
      source={require('../assets/image/pic.png')} 
      style={{
        width: wp('70%'),
        height: wp('70%'),
        borderRadius: wp('1%'), 
        // borderWidth: 2,
        borderColor: 'white',
        marginTop: hp('2%')
      }}
    />
  </View>
  </ScrollView>
 </ImageBackground>
</View>
</TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {flex: 1,justifyContent: 'center',alignItems: 'center'},
  container: {padding: hp('2%'),flexGrow: 1},
});
