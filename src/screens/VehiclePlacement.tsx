import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacesInput = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GooglePlacesAutocomplete
  placeholder="Search for a place"
  onPress={(data, details = null) => {
    console.log(data, details);
  }}
  query={{
    key: 'AIzaSyD9q-QzM7KXhPS110LUa9KMqD06l35oLdg', 
    language: 'en', 
  }}
  fetchDetails={true}
  predefinedPlaces={[]} // ✅ Fix for the error
  styles={{
    textInputContainer: {
      backgroundColor: 'rgba(0,0,0,0)',
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    textInput: {
      marginLeft: 0,
      marginRight: 0,
      height: 38,
      color: '#5d5d5d',
      fontSize: 16,
    },
    predefinedPlacesDescription: {
      color: '#1fa67a',
    },
  }}
/>

    </SafeAreaView>
  );
};

export default GooglePlacesInput;
