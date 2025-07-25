import React, { useEffect, useState , useLayoutEffect} from 'react';
import {View,Text,TouchableOpacity,StyleSheet,ScrollView,ActivityIndicator, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        } else {
          navigation.replace('LoginScreen');
        }
      } catch (error) {
        console.log('❌ Error loading user data:', error);
        navigation.replace('LoginScreen');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, {userData.firstname} 👋</Text>

      {/* <View style={styles.card}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{userData.username}</Text>

        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>
          {userData.firstname} {userData.lastname}
        </Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData.email}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{userData.phone}</Text>

        <Text style={styles.label}>Company:</Text>
        <Text style={styles.value}>{userData.company_name}</Text>
      </View> */}

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('KBRIndentScreen')} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
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
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    marginTop:100,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'navy',
    marginBottom: 30,
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
