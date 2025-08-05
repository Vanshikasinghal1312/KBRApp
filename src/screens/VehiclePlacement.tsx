import React, {useState, useEffect} from "react";
import {View, Text, TextInput, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, Alert, AppState} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useFocusEffect } from "@react-navigation/native";

export default function VehiclePlacementScreen({navigation}){
  const [selectedIntentNumber, setSelectedIntentNumber] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(''); 
  const [searchInput, setSearchInput] = useState('');
  const [cancelledIndents, setCancelledIndents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const token = '4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8';
  const VehiclePlacement_URL = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/vehicleplacement';
  
    useEffect(() => {
    VehiclePlacementFecth();
  }, []);

  useEffect(() => {
  const interval = setInterval(() => {
    VehiclePlacementFecth();
  }, 30000); 

  return () => clearInterval(interval); 
}, []);

  useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      VehiclePlacementFecth();
    }
  });

  return () => subscription.remove();
}, []);

useFocusEffect(
  React.useCallback(() => {
    VehiclePlacementFecth();
  }, [])
);

  const VehiclePlacementFecth = async ()=>{
    try {
    const res = await axios.get (VehiclePlacement_URL,{
      headers:{
        Authorization: `Bearer ${token}`,
      }
    })
    console.log('API response:', res.data);
    const indents = res?.data?.data || [];
    setData(indents);
    setFilteredData(indents);
    setLoading(false)
    } catch (error){
       console.error('API error', error);
      setLoading(false);
    }
  }

  useEffect(()=>{
    let filtered = filteredData;
    if (selectedIntentNumber){
      filtered = filtered.filter(item => item.indent_Number === selectedIntentNumber)
    }
     if (selectedCustomerName) {
      filtered = filtered.filter(item => item.supplier_name === selectedCustomerName);
    }
    setFilteredData(filtered)
    
  },[selectedIntentNumber, selectedCustomerName])

    const toggleDetails = (indentNumber) => {
  const updatedData = data.map((item) =>
    item.indent_number === indentNumber
      ? { ...item, showDetails: !item.showDetails }
      : item
  );

  setData(updatedData);

  const updatedFilteredData = filteredData.map((item) =>
    item.indent_number === indentNumber
      ? { ...item, showDetails: !item.showDetails }
      : item
  );

  setFilteredData(updatedFilteredData);

};

 const renderIndentCard = ({ item }) => (
      <View style={{backgroundColor: 'white',borderRadius: scale(12), padding: moderateScale(20),marginBottom: verticalScale(16), marginRight: wp('1%'), marginLeft:hp('0.1%')}}>
        <Text style={{color:'navy',marginBottom: verticalScale(2),fontWeight: 'bold',fontSize: scale(20), textAlign:'center',textDecorationLine: 'underline'
  }}><Text style={{fontWeight: '800',fontSize:scale(20),color: 'navy'}}>{item.indent_number}</Text></Text>
          <Text style={{fontWeight: 'bold',fontSize: scale(13),color: 'navy',}}>Customer Name: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}>{item.customer_name}</Text> </Text>

        <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Origin: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}>{item.origin}</Text></Text>
        <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Destination: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}>{item.destination}</Text> </Text>
        <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Vehicle Type: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}>{item.Vehicle_type}</Text> </Text>
             <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Supplier Rate: <Text style={{fontWeight:'500',fontSize: scale(14),color: 'black',}}>{item.rate}</Text> </Text>

     <View style={{flexDirection:'row', justifyContent:'space-between',marginTop: hp('1%') }}>
     
         <TouchableOpacity onPress={() => toggleDetails(item.indent_number)} style={{ backgroundColor: 'navy',borderRadius: moderateScale(8),paddingVertical: verticalScale(8),paddingHorizontal: scale(20), alignItems:'center', alignSelf:'center', marginTop:hp('2%'), marginLeft:wp('0.1%'), marginRight:wp('2%')}}>
            <Text style={{color: 'white',fontWeight: 'bold',}}>{item.showDetails ? 'View less' : 'View more'}</Text>
          </TouchableOpacity>
     {
  parseInt(item.placed_vehicles) < parseInt(item.vehicle_count) ? (
    <TouchableOpacity  
      style={{ backgroundColor: 'navy', borderRadius: moderateScale(8), paddingVertical: verticalScale(8), paddingHorizontal: scale(22), alignItems:'center', alignSelf:'center', marginTop:hp('2%'), marginRight:wp('2.9%') }}
      onPress={() => { navigation.navigate('Place VehicleForm', {
  indent_number: item.indent_number,
  dummy_supplier_code: item.dummy_supplier_code,
  rate: item.rate,
  vehicle_count: item.vehicle_count
})
        console.log('Placing vehicle for:', item.indent_number);
      }}
    >
      <Text style={{color: 'white', fontWeight: 'bold'}}>Place Vehicle +</Text>
    </TouchableOpacity>
  ) : (
    <Text style={{ marginTop: hp('2%'), fontWeight: 'bold', color: 'green', alignSelf: 'center' }}>
      All Vehicle Placed
    </Text>
  )
}

      </View>
       {item.showDetails && (
          <View style={{marginTop: hp('1%'),}}>
        <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Supplier Name: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}> {item.supplier_name}</Text></Text>
        <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Vehicle/Tonn Count: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}>{item.vehicle_count}</Text> </Text>
       </View>
        )}
       
      </View>
    );  
    
      if (loading) return <ActivityIndicator size="large" style={{ marginTop: hp('5%') }} />;
  return (
    <View style={{flex:1, marginTop: hp('0.5%'),marginLeft:wp('3%'), }}>
  <View style={{marginHorizontal:scale(8)}}>
    <View style={{flexDirection:'row',marginTop: hp('0.1%')}}>
      
       <View style={{ borderWidth: moderateScale(1), borderColor: '#ccc', borderRadius: moderateScale(6), marginRight: wp('2%'), marginVertical: hp('3%'), width: wp('30%'), backgroundColor: '#fff' }}>
  <Picker
    dropdownIconColor="navy"
    selectedValue={filterType}
    onValueChange={(itemValue) => {
      setFilterType(itemValue);
      setSelectedIntentNumber(null);
      setSelectedCustomerName(null);
      setSearchInput('');
      setFilteredData(data); 
    }}
  >
    <Picker.Item label="Select" value="" />
    <Picker.Item label="Indent Number" value="Indent Number" />
    <Picker.Item label="Customer Name" value="Customer Name" />
  </Picker>
</View>
        <TextInput
          style={{ borderWidth: 1, marginRight: wp('2%'), borderColor: '#ccc', width: wp('44%'),backgroundColor: '#fff',borderRadius: 6, marginVertical: hp('3%'), textAlign:'left'}}      
          placeholder={`Enter ${filterType}`}
          placeholderTextColor={'grey'}
           value={searchInput}
  onChangeText={setSearchInput}
        />
      <View style={{flex:0.1}}> 
            <TouchableOpacity 
              onPress={() => {
    if (!filterType) {
     Alert.alert('Please select type');
      return;
    }

    if (!searchInput.trim()) {
     Alert.alert('Please enter a search value');
      return;
    }

    let filtered = [];

    if (filterType === 'Indent Number') {
      const isValid = data.some(item => item.indent_number?.toLowerCase() === searchInput.toLowerCase());

      if (!isValid) {
        Alert.alert('Invalid Indent Number');
        return;
      }

      filtered = data.filter(item => item.indent_number?.toLowerCase() === searchInput.toLowerCase());
    } 
    
    else if (filterType === 'Customer Name') {
      const isValid = data.some(item => item.supplier_name?.toLowerCase().includes(searchInput.toLowerCase()));

      if (!isValid) {
        Alert.alert('Invalid Customer Name');
        return;
      }

      filtered = data.filter(item => item.supplier_name?.toLowerCase().includes(searchInput.toLowerCase()));
    }

    setFilteredData(filtered);
  }}
            style={{ marginTop: hp('3.5%'),height: wp('14%'), width: wp('12%'), borderRadius: wp('1%'), justifyContent: 'center', alignItems: 'center', backgroundColor: 'navy'}}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>🔍</Text>
            </TouchableOpacity>
      </View>
    </View>   
    {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        <View>
        <FlatList
          data={filteredData}
            renderItem={renderIndentCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: hp('30%') }}
             refreshing={refreshing}
  onRefresh={async () => {
    setRefreshing(true);
    await VehiclePlacementFecth();
    setRefreshing(false);
  }}
         />
        </View>
      )}      
  </View> 
</View>
  )
}