import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useState}from "react";
import {Text,View,TextInput, Alert,TouchableOpacity, Image, SafeAreaView, ImageBackground} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

export default function LoginScreen({navigation}){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);

 const handleLogin= async()=>{
    if (!username || !password) {
      Alert.alert('Please enter both fields username and password');
      return;
    }
    console.log('Logging in with:', { username, password });    
   try{
     const response = await fetch ('https://kbrtransways.com/testing/tms/tms_api2/index.php/login',{
      method:'POST',
      headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
        password: password.trim(),
          deviceToken:1212, 
          app_version:1 
        })
     })
    const json = await response.json()
    console.log('API response:', json);
    console.log("Full API Data:", JSON.stringify(json.data, null, 2));
    console.log("Login status from API:", json.status);
    
    if (json.status == 1 || json.status === '1') {
        const user = json.data[0];
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        // console.log("✅ Saved to AsyncStorage:", user);
        // console.log('✅ Credentials saved');
        await AsyncStorage.setItem('userId', user.user_id);
        navigation.replace('MainApp');
      } else {
        Alert.alert('Login Failed!', json.message || 'Please Enter Valid Credentials')
      }
    }catch (error){
      // console.log(error);
      Alert.alert('Error',' something went wrong')
   }
  }
  return (
<ImageBackground style={{  flex:1}} 
source={require('../assets/image/login_Image.png')} resizeMode='cover'>     
  <SafeAreaView style={{width: wp('80%'),height: hp('55%'),justifyContent:'center',alignSelf:'center',backgroundColor: 'white',marginTop:hp('15%'),borderRadius:40,padding: 20,alignItems: 'center',shadowColor: '#000', shadowOpacity: 0.1,shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 5,}}>
      <Image style={{ width: 190, marginTop:hp('0.1%'),height: 80,alignSelf:'center',marginBottom:25}}
        source={require('../assets/image/logo.png')}/>
      <View style={{ width: '90%',marginBottom: 16,backgroundColor: '#F0F0F0',borderRadius: 25,borderColor: '#ccc',borderWidth: 1,flexDirection: 'row',alignItems: 'center',paddingHorizontal: 12, }}>
        <Icon name="account" size={20} color="#666" style={{marginRight: 8}} />
      <TextInput  style={{flex: 1,paddingVertical: 10,fontSize: 14,color: '#333',}}
      placeholder="Username"
      value= {username}
      onChangeText={setUsername}
      />
      </View>
    <View style={{ width: '90%',marginBottom: 16,backgroundColor: '#F0F0F0',borderRadius: 25,borderColor: '#ccc',borderWidth: 1,flexDirection: 'row',alignItems: 'center',paddingHorizontal: 12, }}>
         <Icon name="lock" size={20} color="#666" style={{ marginRight: 8 }}/>
      <TextInput 
      style={{flex: 1,paddingVertical: 10,fontSize: 14,color: '#333'}}
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry={!showPassword}
      />
    <TouchableOpacity style={{ position: 'absolute',right: 12,top: 14,}}
        onPress={() => setShowPassword(!showPassword)}>
        <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#666" />
      </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleLogin}
      style={{ backgroundColor: '#00457c',paddingVertical: 12,paddingHorizontal:2,borderRadius: 70,width: '70%',alignItems: 'center',marginTop: hp('0.5%'),}}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16 , alignItems:'center'}}>Login</Text>
      </TouchableOpacity>       
    </SafeAreaView>
    </ImageBackground>
  )
}