import React, {useState, useEffect, useCallback} from "react";
import {View, Text, TextInput, TouchableOpacity,FlatList, ActivityIndicator, Alert, AppState} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";


export default function KBRIndentScreen(){
  const [selectedIntentNumber, setSelectedIntentNumber] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(''); // Indent Number or Customer Name
  const [searchInput, setSearchInput] = useState('');
  const [cancelledIndents, setCancelledIndents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


useEffect(() => {
  const loadCancelledIndents = async () => {
    try {
      const stored = await AsyncStorage.getItem('cancelledIndents');
      if (stored) {
        const cancelledList = JSON.parse(stored);
        setCancelledIndents(cancelledList);
        const updated = data.map(item => ({...item, cancelled: cancelledList.includes(item.indent_number)}));
        setData(updated);
        setFilteredData(updated);
      }
    } catch (error) {
      console.log('Error loading cancelled indent list', error);
    }
  };
  loadCancelledIndents();
}, [loading]); 

  const token = '4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8';
  const API_URL = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/getallindents';

    useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // ✅ Fetch every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch when app returns to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState === "active") {
        fetchData();
      }
    });

    return () => subscription.remove();
  }, []);

  const fetchData = async ()=>{
      setRefreshing(true);

    try {
    const res = await axios.get (API_URL,{
      headers:{
        Authorization: `Bearer ${token}`,
      }
    })
    // console.log('API response:', res.data);
    const indents = res?.data?.data || [];
    const stored = await AsyncStorage.getItem('cancelledIndents');
    const cancelledList = stored ? JSON.parse(stored) : [];
    const enriched = indents.map(item => ({ ...item, cancelled: cancelledList.includes(item.indent_number)}));
    setData(enriched);
    setFilteredData(enriched);
    setLoading(false)
    } catch (error){
       console.error('API error', error);
      setLoading(false);
    }finally {
    setLoading(false);
    setRefreshing(false);
  }
    const indents = res?.data?.data.map(item => ({...item,cancelled: false }));
  }

 const handleCancelIndent = (indentNumber, indentId) => {
  Alert.alert(
    "Cancel Indent",
    "Are you sure you want to cancel this indent?",
    [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const cancelUrl = `https://kbrtransways.com/testing/tms/tms_api2/index.php/cancelindent/${indentId}`;

            const response = await axios.get(cancelUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });

            if (response.data?.status === '1') {
              // Mark it as cancelled in local state
              const updatedData = data.map(item =>
                item.id === indentId
                  ? { ...item, cancelled: true, status:'1' }
                  : item
              );
              setData(updatedData);

              const updatedFiltered = filteredData.map(item =>
                item.id === indentId
                  ? { ...item, cancelled: true, status:'1'}
                  : item
              );
              setFilteredData(updatedFiltered);
            } else {
              Alert.alert("Failed", response.data?.msg || "Cancel request failed.");
            }
          } catch (error) {
            console.error("Cancel API error:", error);
            Alert.alert("Error", "Failed to cancel indent. Please try again.");
          }
        },
        style: "destructive"
      }
    ]
  );
};



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
    <View style={{backgroundColor: 'white', borderRadius: moderateScale(12),padding: moderateScale(20),marginBottom: verticalScale(16),elevation: 3, marginRight: wp('1%'), marginLeft:hp('0.1%')}}> 
      <Text style={{color:'navy', marginBottom: verticalScale(2),fontWeight: 'bold',fontSize: scale(20), textAlign:'center',textDecorationLine: 'underline'}}><Text style={{
  color: item.cancelled || item.status === '1' || item.status === 1 ? 'red' : 'navy',
  marginBottom: verticalScale(2),fontWeight: 'bold',fontSize: scale(20),textAlign: 'center',textDecorationLine: 'underline'
}}>
  {item.indent_number}
  {(item.cancelled || item.status === '1' || item.status === 1) && '- Cancelled'}
</Text>
</Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Customer Name:<Text style={{fontWeight:'500',fontSize: scale(14),color: 'black',}}> {item.supplier_name}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Origin: <Text style={{fontWeight:'500',fontSize: scale(14),color: 'black',}}>{item.from_location}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Destination: <Text style={{fontWeight:'500',fontSize: scale(14),color: 'black',}}>{item.to_location}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Loading Date: <Text style={{fontWeight:'500',fontSize: scale(14),color: 'black',}}>{item.loading_date}</Text> </Text>    
     <View style={{flexDirection:'row', justifyContent:'space-between'}}>
       <TouchableOpacity onPress={() => toggleDetails(item.indent_number)} style={{ backgroundColor: 'navy',borderRadius: moderateScale(8),paddingVertical: verticalScale(8),paddingHorizontal: scale(20),marginTop:hp('2%'), marginRight:wp('1.5%')}}>
          <Text style={{color: 'white',fontWeight: 'bold',}}>{item.showDetails ? 'View less' : 'View more'}</Text>
        </TouchableOpacity>
          {!(item.cancelled || item.status === '1' || item.status === 1) && (
    <TouchableOpacity onPress={() => handleCancelIndent(item.indent_number, item.id)} 
    style={{backgroundColor: 'red',borderRadius: moderateScale(8),paddingVertical: verticalScale(8),paddingHorizontal: scale(30), marginTop:hp('2%'), marginRight:wp('4%')}}>
      <Text style={{ fontWeight:'bold', color: 'white' }}>Cancel</Text>
    </TouchableOpacity>   
  )}
  </View>   
     {item.showDetails && (
        <View style={{marginTop: 10,}}>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Indent Start Date: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}>{item.indent_start_date}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Indent Closing Date: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}> {item.indent_end_date}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Vehicle Type: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}>{item.vehicle_type_name}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Costing Type: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}>{item.costing_type === '1' ? 'Per Vehicle' : item.costing_type === '2' ? 'Per Tonn' : 'N/A'}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Vehicle/Tonn Count: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}>{item.number_of_vehicles}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Total Indent Amount: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}>{item.indent_amount}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Advance Payment: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}>{item.advance_amount}</Text> </Text>
     </View>
      )}
    </View>
  );  
    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  return (
    <View style={{flex:1, marginTop: hp('0.5%'),marginLeft:wp('3%'), }}>
  <View style={{marginHorizontal:scale(8)}}>
    <View style={{flexDirection:'row',marginTop: hp('0.1%')}}>    
       <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginRight: wp('2%'), marginVertical: hp('3%'), width: wp('30%'), backgroundColor: '#fff' }}>
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
            onRefresh={fetchData}
        />
        </View>
      )}      
  </View>

 
</View>
  )
}