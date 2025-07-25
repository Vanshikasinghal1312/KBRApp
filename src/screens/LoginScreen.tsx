import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useState}from "react";
import {Text,TextInput, Alert,TouchableOpacity, Image, SafeAreaView} from 'react-native'

export default function LoginScreen({navigation}){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
        console.log("✅ Saved to AsyncStorage:", user);
        console.log('✅ Credentials saved');

        await AsyncStorage.setItem('userId', user.user_id);
        navigation.replace('MainApp');
      } else {
        Alert.alert('login Failed', json.message || 'invalid credentials')
      }
    }catch (error){
      console.log(error);
      Alert.alert('Error',' something went wrong')
   }
  }
  return (
    <SafeAreaView style={{flex:1}}>
      <Image style={{ width: 190, marginTop:60,height: 80,alignSelf:'center',}}
      source={require('../assets/image/logo.png')}/>
      <TextInput style={{ marginTop:40, marginHorizontal: 20,   backgroundColor: '#fff',padding: 14,borderRadius: 20,marginBottom: 16,borderColor: '#ccc',borderWidth: 1, justifyContent:'center'}}
      placeholder="Username"
      value= {username}
      onChangeText={setUsername}
      />
      <TextInput style={{ backgroundColor: '#fff',marginHorizontal: 20,padding: 14,borderRadius: 20,marginBottom: 16,borderColor: '#ccc',borderWidth: 1,}}
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry={true}
      />
      <TouchableOpacity onPress={handleLogin}
        style={{backgroundColor:'navy', padding:10, alignItems:'center', borderRadius:20, justifyContent: 'center', marginHorizontal:20}}>
        <Text style={{color:'white',fontWeight:'600', fontSize: 20, alignItems:'center'}}>Login</Text>
      </TouchableOpacity>       
    </SafeAreaView>
  )
}