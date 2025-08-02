import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthLoadingScreen({ navigation }) {
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        console.log("✅ USER DATA FOUND:", userData);

        if (userData !== null) {
          navigation.replace('MainApp');
        } else {
          navigation.replace('Login Screen');
        }
      } catch (e) {
        console.log("❌ Error reading AsyncStorage:", e);
        navigation.replace('Login Screen');
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="navy" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  }
});
