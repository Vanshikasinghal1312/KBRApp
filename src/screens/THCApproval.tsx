import React, {useState, useEffect} from "react";
import {View, Text, TextInput, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, Alert, AppState} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";

export default function THCApprovalScreen({navigation}){
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
  const THC_APPROVAL_URL = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/thc_approval_list';
  

    useEffect(() => {
    THCApproval();
  }, []);

  useEffect(() => {
  const interval = setInterval(() => {
    THCApproval();
  }, 30000); // refresh every 30 seconds (30000 ms)

  return () => clearInterval(interval); // cleanup on unmount
}, []);

  useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      THCApproval();
    }
  });

  return () => subscription.remove();
}, []);

useFocusEffect(
  React.useCallback(() => {
    THCApproval();
  }, [])
);

  const THCApproval = async ()=>{
    try {
    const res = await axios.get (THC_APPROVAL_URL,{
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
  Alert.alert(`${actionType} Successful`, `Indent has been ${statusValue}`);

};


const handleStatusUpdate = (id, statusValue, actionType) => {
  Alert.alert(
    'Confirmation',
    `Are you sure you want to ${actionType} this supplier?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const res = await axios.post(
              'https://kbrtransways.com/testing/tms/tms_api2/index.php/updatethcstatus',
              { id, status: statusValue },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            console.log(`${actionType} response:`, res.data);

            if (res?.data?.status === '1' || res?.data?.success) {
              const updatedList = filteredData.filter(item => item.id !== id);
              setFilteredData(updatedList);
              setData(prev => prev.filter(item => item.id !== id));
            } else {
              Alert.alert(`${actionType} Failed`, res?.data?.message || 'Something went wrong');
            }
          } catch (error) {
            console.error(`${actionType} API Error:`, error);
            Alert.alert('Error', `Failed to ${actionType.toLowerCase()} indent`);
          }
        },
      },
    ]
  );
};

const HandleApprove = (id) => {
  handleStatusUpdate(id, 'approve', 'Approve');
};

const handleReject = (id) => {
  handleStatusUpdate(id, 'reject','Reject');
};

   const renderIndentCard = ({ item }) => (
    
    <View style={{backgroundColor: 'white', borderRadius: moderateScale(12),padding: moderateScale(20),marginBottom: verticalScale(16),elevation: 3, marginRight: wp('1%'), marginLeft:hp('0.1%')}}> 
   
      <Text style={{color:'navy',marginBottom: verticalScale(2),fontWeight: 'bold',fontSize: scale(20), textAlign:'center',textDecorationLine: 'underline'}}><Text style={{
  color: item.cancelled || item.status === '1' || item.status === 1 ? 'red' : 'navy',
 marginBottom: verticalScale(2),fontWeight: 'bold',fontSize: scale(20),textAlign: 'center',textDecorationLine: 'underline'
}}>
  {item.indent_number}
  {(item.cancelled || item.status === '1' || item.status === 1) && '- Cancelled'}
</Text>
</Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>THC Date:<Text style={{fontWeight:'500',fontSize: scale(14),color: 'black',}}> {item.thc_date}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Vehicel Number: <Text style={{fontWeight:'500',fontSize:scale(14),color: 'black',}}>{item.vehicle_number}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Vendor Name: <Text style={{fontWeight:'500',fontSize: scale(14),color: 'black',}}>{item.vendor_name}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Origin: <Text style={{fontWeight:'500',fontSize:scale(14) ,color: 'black',}}>{item.from_location}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Destination: <Text style={{fontWeight:'500',fontSize:scale(14) ,color: 'black',}}>{item.to_location}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Contract amount : <Text style={{fontWeight:'500',fontSize:scale(14) ,color: 'black',}}>{item.contract_amount}</Text> </Text>

     
     <View style={{flexDirection:'row', justifyContent:'space-between'}}>
       <TouchableOpacity 
 onPress={() => {
     const thcLink = `https://kbrtransways.com/testing/tms/admin/view_thc3.php?trip_id=${item.id}`;
     navigation.navigate('THC View', { link: thcLink });
   }}       style={{ backgroundColor: 'navy',borderRadius: moderateScale(8),paddingVertical: verticalScale(8),paddingHorizontal: scale(8), marginTop:hp('2%'), marginRight:wp('1%')}}>
          <Text style={{color: 'white',fontWeight: 'bold',}}>{item.showDetails ? 'View less' : 'View more'}</Text>
        </TouchableOpacity>
  <TouchableOpacity
    onPress={() => HandleApprove(item.id)}
    style={{ backgroundColor: 'green',borderRadius: moderateScale(8),paddingVertical: verticalScale(8),paddingHorizontal: scale(16), marginTop:hp('2%'),marginRight:wp('1%')}}
  >
    <Text style={{ color: 'white', fontWeight: 'bold' }}>Approve</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => handleReject(item.id)}
    style={{ backgroundColor: 'red', borderRadius: moderateScale(8),paddingVertical: verticalScale(8),paddingHorizontal: scale(16), marginTop:hp('2%'),marginRight:wp('1.5%')}}
  >
    <Text style={{ color: 'white', fontWeight: 'bold' }}>Reject</Text>
  </TouchableOpacity>
          
  </View>

    </View>
  );  
    if (loading) return <ActivityIndicator size="large" style={{ marginTop: hp('5%') }} />;
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
  onRefresh={async () => {
    setRefreshing(true);
    await THCApproval();
    setRefreshing(false);
  }}
         />
        </View>
      )}      
  </View> 
</View>
  )
}