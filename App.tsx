import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './src/navigation/AuthNavigator'
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';


export default function App(){
  //  const [isLoading, setLoading] = React.useState(true);
  // const [isLoggedIn, setLoggedIn] = React.useState(false);
    
  //   useEffect(()=>{
  //     const checkLoginStatus = async()=>{
  //       const token = await AsyncStorage.getItem('userToken')
  //       setLoggedIn(!!token)
  //       setLoading(false)
  //     }
  //     checkLoginStatus()
  //   },[])
  //   if (isLoading) return null;
  
  // return(
  //  // <SafeAreaView style={{flex:1}}> 
  //   <NavigationContainer>
  //       {isLoggedIn ? <StackNavigator/> : <AuthNavigator/> }
  //   </NavigationContainer>
  // //  </SafeAreaView>
    
  // )
  return (
<SafeAreaView style={{flex:1}}> 
     <NavigationContainer>
      <StackNavigator/>
     </NavigationContainer>
   </SafeAreaView>
  )


}
