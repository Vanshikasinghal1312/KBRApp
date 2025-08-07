import React, {useState, useEffect, useCallback} from "react";
import {View, Text, TextInput, TouchableOpacity,FlatList, ActivityIndicator, Alert, AppState} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function KBRIndentScreen(){
  const [selectedIntentNumber, setSelectedIntentNumber] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(''); 
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
    <View style={{ backgroundColor: '#06244F',borderRadius: wp('6%'),padding: wp('4%'),marginBottom: verticalScale(16),overflow:'hidden'}}> 
    <View style={{backgroundColor: '#00457c', paddingVertical: hp('1%'),paddingHorizontal: wp('0.09%'),borderTopLeftRadius: wp('3%'),borderTopRightRadius: wp('3%')}}>
      <Text style={{color:'#eec340',fontWeight: 'bold',fontSize: wp('5.5%'), marginLeft:wp('2%'),alignItems:'center',justifyContent:'center'}}><Text style={{
  color: item.cancelled || item.status === '1' || item.status === 1 ? '#df4444' : '#eec340',fontWeight: 'bold',fontSize: wp('5.2%'), alignItems:'center'}}>
  {item.indent_number}
  {(item.cancelled || item.status === '1' || item.status === 1) && '- Cancelled'}
</Text>
</Text>
</View>
      <Text style={{ color: '#fff',fontWeight: '600',fontSize: wp('3.8%'),marginTop:hp('2%')}}>Customer Name: <Text style={{ color: '#ccc',fontSize: wp('3.8%'),marginBottom: hp('0.8%'),fontWeight:'400'}}> {item.supplier_name}</Text></Text>
      <Text style={{color: '#fff',fontWeight: '600',fontSize: wp('3.8%')}}>Loading Date:  <Text style={{color: '#ccc',fontSize: wp('3.8%'),marginBottom: hp('0.8%'),fontWeight:'400'}}>{item.loading_date}</Text> </Text>    
  
{/* <View style={{ flexDirection: 'row', justifyContent: 'center',  marginTop: 10, paddingHorizontal: 8}}>
  <Text 
    style={{ flex: 3, textAlign: 'left', fontSize: 13, color: 'white', flexWrap: 'wrap',paddingRight: 4}}
    numberOfLines={3} ellipsizeMode='tail'
  >{item.from_location}</Text>
 <Text style={{ color: 'white', fontSize: 12, marginHorizontal:1 }}>-------</Text>
  <Icon name="truck" size={20} color="white" />
  <Text style={{ color: 'white', fontSize: 12, marginHorizontal: 2 }}>-------</Text>

  <Text 
    style={{ flex: 3, textAlign: 'left', fontSize: 13, color: 'white', flexWrap: 'wrap',paddingLeft: 4}}
    numberOfLines={3}
    ellipsizeMode='tail'
  >
    {item.to_location}
  </Text>
</View> */}

    <View style={{
  flexDirection: 'row',
  marginTop:hp('2%'),
  alignItems:'center'
}}>

  {/* ORIGIN */}
  <View style={{ flex:2, alignItems: 'flex-start' }}>
    {(() => {
      const fromParts = item.from_location?.split(',') || [];
      const fromMain = fromParts[0]?.trim() || '';
      const fromRest = fromParts.slice(1).join(',').trim();
      return (
        <View>
          <Text style={{ fontSize:moderateScale(13), fontWeight: 'bold', color: 'white' }}>{fromMain}</Text>
          {fromRest !== '' && (
            <Text style={{ fontSize: moderateScale(10), color: 'white' }}>{fromRest}</Text>
          )}
        </View>
      );
    })()}
  </View>

  {/* LINE + TRUCK */}
  <View style={{ flex: 4, flexDirection: 'row', alignItems: 'center' }}>
       <View
    style={{
      flex: 1,
      borderBottomWidth: moderateScale(1),
      borderColor: 'white',
      borderStyle: 'dotted',
    }}
  />
  
    {/* <View style={{ flex: 1, height: 1, backgroundColor: 'white', }} /> */}
    <Icon name="truck" size={26} color="white" style={{ marginHorizontal:wp('1%') }} />
    {/* <View style={{ flex: 1, height: 1, backgroundColor: 'white' }} /> */}
    <View
    style={{
      flex: 1,
      borderBottomWidth: moderateScale(1),
      borderColor: 'white',
      borderStyle: 'dotted',
    }}
  />
  
  
  </View>

  {/* DESTINATION */}
  <View style={{ flex: 2, alignItems: 'center' }}>
    {(() => {
      const toParts = item.to_location?.split(',') || [];
      const toMain = toParts[0]?.trim() || '';
      const toRest = toParts.slice(1).join(',').trim();
      return (
        <View style={{ alignItems:'flex-start' }}>
          <Text style={{ fontSize:moderateScale(13), fontWeight: 'bold', color: 'white' }}>{toMain}</Text>
          {toRest !== '' && (
            <Text style={{ fontSize:moderateScale(10), color: 'white' }}>{toRest}</Text>
          )}
        </View>
      );
    })()}
  </View>

</View>


    
     <View style={{flexDirection:'row', justifyContent:'space-between'}}>
       <TouchableOpacity onPress={() => toggleDetails(item.indent_number)} style={{ backgroundColor: '#eec340',borderRadius: wp('6%'),paddingVertical:hp('0.5%'),paddingHorizontal: wp('4.5%'),marginTop:hp('2%'), marginRight:wp('1.5%')}}>
          <Text style={{color: 'black',fontWeight: 'bold', fontSize: wp('3.2%') }}>{item.showDetails ? 'View less' : 'View more ▼'}</Text>
        </TouchableOpacity>
          {!(item.cancelled || item.status === '1' || item.status === 1) && (
    <TouchableOpacity onPress={() => handleCancelIndent(item.indent_number, item.id)} 
    style={{backgroundColor: '#df4444',borderRadius: wp('6%'),paddingVertical:hp('0.5%'),paddingHorizontal:wp('4.5%'), marginTop:hp('2%'), marginRight:wp('4%')}}>
      <Text style={{ color: 'white',fontWeight: 'bold', fontSize: wp('3.2%')  }}>Cancel Trip</Text>
    </TouchableOpacity>   
  )}
  </View>   
     {item.showDetails && (
        <View style={{marginTop:hp('1%'),}}>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Indent Start Date:   <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),fontWeight:'400'}}>{item.indent_start_date}</Text> </Text>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Indent Closing Date:  <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),fontWeight:'400'}}> {item.indent_end_date}</Text></Text>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Vehicle Type:   <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),fontWeight:'400'}}>{item.vehicle_type_name}</Text></Text>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Costing Type:   <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),fontWeight:'400'}}>{item.costing_type === '1' ? 'Per Vehicle' : item.costing_type === '2' ? 'Per Tonn' : 'N/A'}</Text></Text>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Vehicle/Tonn Count:   <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),fontWeight:'400'}}>{item.number_of_vehicles}</Text> </Text>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Total Indent Amount:   <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),fontWeight:'400'}}>{item.indent_amount}</Text> </Text>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Advance Payment:   <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),fontWeight:'400'}}>{item.advance_amount}</Text> </Text>
     </View>
      )}
    </View>
  );  
    if (loading) return <ActivityIndicator size="large" style={{ marginTop: hp('4%') }} />;
  return (
    <View style={{flex:1, backgroundColor: '#1C1C1C',padding:wp('3%'),}}>
  <View style={{marginHorizontal:scale(8)}}>
    <View style={{flexDirection:'row',marginTop: hp('0.1%')}}>    
       <View style={{ borderWidth: 1, borderColor: 'white', borderRadius:moderateScale(6), marginRight: wp('2%'),marginVertical: hp('1.5%'), width: wp('30%'), height: hp('5%'), backgroundColor: 'black',  justifyContent: 'center'}}>
  <Picker
    dropdownIconColor="white"
    selectedValue={filterType}
    onValueChange={(itemValue) => {
      setFilterType(itemValue);
      setSelectedIntentNumber(null);
      setSelectedCustomerName(null);
      setSearchInput('');
      setFilteredData(data); 
    }}
    style={{
    height: hp('1%'),  // Reduce height
    color: 'white',      // Set selected text color
    fontSize: wp('3.5%'),
  }}
  >
    <Picker.Item label="Select" value="" />
    <Picker.Item label="Indent Number" value="Indent Number" />
    <Picker.Item label="Customer Name" value="Customer Name" />
  </Picker>
</View>
        <TextInput
          style={{ borderWidth: moderateScale(1), marginRight: wp('2%'), borderColor: 'white', width: wp('44%'), height:hp('5%'),backgroundColor:'#424244',borderRadius: 6, marginVertical: hp('1.5%'), textAlign:'left'}}      
          placeholder={`Search ${filterType}`}
          placeholderTextColor={'white'}
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
            style={{ marginTop: hp('1.6%'), width: wp('12%'),height:hp('4.8%'), borderRadius: wp('1%'), justifyContent: 'center', alignItems: 'center', backgroundColor: '#06244F',borderColor: 'white',borderWidth:1 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>🔍</Text>
            </TouchableOpacity>
      </View>
    </View>   
    {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : filteredData.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: hp('15%') }}>
          <Icon name="folder-open" size={wp('25%')} color="#999" />
          <Text style={{color: 'white',fontSize: wp('5%'),fontWeight: 'bold',marginTop: hp('2%')}}>No Data Found</Text>
        </View>
      ): (
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