import React, {useState, useEffect} from "react";
import {View, Text, TextInput, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, Alert, Modal, AppState} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function AvailiableIndents(){
  const [userId, setUserId] = useState('');
const [refreshing, setRefreshing] = useState(false); 
  const [selectedIntentNumber, setSelectedIntentNumber] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(''); 
  const [searchInput, setSearchInput] = useState('');
const [selectedIndent, setSelectedIndent] = useState(null);
const [modalVisible, setModalVisible] = useState(false);

const [brokerName, setBrokerName] = useState('');
const [count, setCount] = useState('');
const [rate, setRate] = useState('');
const [showError, setShowError] = useState(false);
const [brokerList, setBrokerList] = useState([]);


  const token = '4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8';
  const API_URL = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/availableindent';
  const BROKER_API_URL = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/getallbrokers';
  const SUBMIT_API_URL= 'https://kbrtransways.com/testing/tms/tms_api2/index.php/addsupplierdata'


  useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      fetchData(); // Refresh data when app is focused again
    }
  });

  return () => {
    subscription.remove(); // Clean up
  };
}, []);

useFocusEffect(
  React.useCallback(() => {
    fetchData(); // Refresh data every time screen comes into focus
  }, [])
);



   useEffect(() => {
   const fetchUserId = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserId(parsed.id); // make sure userId is in state
    }
  };
  fetchUserId();
}, []);



  useEffect(()=>{
    const fetchBrokerList= async()=>{
     try {
      const response = await axios.get(BROKER_API_URL,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      console.log("✅ Broker API Raw Response:", response.data);

if (response.data?.status === "1") {
        setBrokerList(response.data.data); // this is an array of strings
                  console.log("✅ Broker list fetched:", response.data.data);
      }   else {
          console.warn("⚠️ Broker API returned unexpected status:", response.data.status);
        }  
    } catch(error){
      console.log('Broker API Error',error)
     }
    }
    fetchBrokerList()
  },[])


    useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async ()=>{
    try {
    const res = await axios.get (API_URL,{
      headers:{
        Authorization: `Bearer ${token}`,
      }
    })
    console.log('API response:', res.data);

    const indents = res?.data?.data || [];
    setData (indents)
    setFilteredData(indents)
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
    <View style={{backgroundColor: '#06244F',borderRadius: wp('6%'), padding: wp('4%'),marginBottom: verticalScale(16), marginLeft:hp('0.1%'),overflow:'hidden'}}>
     <View style={{
        backgroundColor: '#00457c', 
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('0.09%'),
        borderTopLeftRadius: wp('3%'),
        borderTopRightRadius: wp('3%'),
        }}>
          <Text style={{color:'#eec340',fontWeight: 'bold',fontSize: wp('5.5%'), marginLeft:wp('2%'),alignItems:'center',justifyContent:'center'}}><Text style={{fontWeight: 'bold',fontSize: wp('5.4%'), alignItems:'center',color:'#eec340',}}>{item.indent_number}</Text></Text>
          </View> 
   <Text style={{ color: '#fff',fontWeight: '600',fontSize: wp('3.8%'),marginTop:hp('2%')}}>Customer Name:  <Text style={{ color: '#ccc',fontSize: wp('3.8%'),marginBottom: hp('0.8%'),}}> {item.supplier_name}</Text></Text>
        <Text style={{color: '#fff',fontWeight: '600',fontSize: wp('3.8%')}}>Loading Date:  <Text style={{color: '#ccc',fontSize: wp('3.8%'),marginBottom: hp('0.8%'),}}>{item.loading_date}</Text> </Text>    
    
          <View style={{
        flexDirection: 'row',
        marginTop: 10,
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
            borderBottomWidth: 1,
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
            borderBottomWidth: 1,
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
      
   <View style={{flexDirection:'row', justifyContent:'space-between' }}>
   <TouchableOpacity onPress={() => toggleDetails(item.indent_number)} style={{ backgroundColor: '#eec340',borderRadius: wp('6%'),paddingVertical:hp('0.5%'),paddingHorizontal: wp('4.5%'),marginTop:hp('2%'), marginRight:wp('1.5%')}}>
             <Text style={{color: 'black',fontWeight: 'bold', fontSize: wp('3.2%') }}>{item.showDetails ? 'View less' : 'View more ▼'}</Text>
           </TouchableOpacity>
     <TouchableOpacity  onPress={() => {
    setSelectedIndent(item);
    setModalVisible(true);
  }}
    style={{backgroundColor: '#df4444',borderRadius: wp('6%'),paddingVertical:hp('0.5%'),paddingHorizontal:wp('4%'), marginTop:hp('2%'), marginRight:wp('4%')}}>  
  <Text style={{color: 'white',fontWeight: 'bold', fontSize: wp('3.2%') }}>Place Vehicle +</Text>
  </TouchableOpacity>
    </View>
     {item.showDetails && (
        <View style={{marginTop: hp('1%'),}}>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Indent Start Date: <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),}}>{item.indent_start_date}</Text> </Text>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Indent Closing Date: <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),}}> {item.indent_end_date}</Text></Text>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Vehicle Type: <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),}}>{item.vehicle_type_name}</Text></Text>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Costing Type: <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),}}>{item.costing_type === '1' ? 'Per Vehicle' : item.costing_type === '2' ? 'Per Tonn' : 'N/A'}</Text></Text>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Vehicle/Tonn Count: <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),}}>{item.number_of_vehicles}</Text> </Text>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Remaining Vehicle/Tonn to Place: <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),}}>{item.remaining_vehicle_count}</Text> </Text>
      <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Target Rate: <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),}}>{item.market_rate}</Text> </Text>   
     </View>
      )}
     
    </View>
  );  
  
    if (loading) return <ActivityIndicator size="large" style={{ marginTop: hp('5%') }} />;


   const handleSubmit = async (item) => {
  if (!brokerName) {
    Alert.alert("Validation Error", "Please select a Broker name.");
    return;
  }

  if (!count || isNaN(count) || parseInt(count) <= 0) {
    Alert.alert("Validation Error", "Please enter a valid vehicle/ton count greater than 0.");
    return;
  }

  if (!rate || isNaN(rate) || parseFloat(rate) <= 0) {
    Alert.alert("Validation Error", "Please enter a valid rate greater than 0.");
    return;
  }

  // 🚨 New Validation: count must be <= remaining_vehicle_count
  if (parseInt(count) > parseInt(item.remaining_vehicle_count)) {
    Alert.alert(
      "Validation Error",`Count cannot exceed ${item.remaining_vehicle_count}.`
    );
    return;
  }

  try{
    const payload= {
    user_id: userId,
    indent_id: item.id,
    indent_number: item.indent_number,
    supplier_name: brokerName,
    vehicle_count: count,
    rate:rate
    }
        console.log('📦 Payload being sent:', payload);

    const response = await axios.post(SUBMIT_API_URL,payload,{
       headers:{
        Authorization:`Bearer ${token}`,
        'Content-Type':'application/json'
       }      
    })
        console.log('🚀 Submit response:', response.data);
   
    if (response.data?.status === '1'){
      Alert.alert('Success', 'Vehicle placed successfully!');
      setModalVisible(false);
      setBrokerName('');
      setCount('');
      setRate('');
    } else{
            Alert.alert('Error', response.data?.msg || 'Failed to submit data.');

    }

  } catch(error){
       console.error('❌ POST API Error:', error);
    Alert.alert('Error', 'Something went wrong while submitting the data.');
  }
};

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
          style={{ marginTop: hp('1.6%'), width: wp('12%'),height:hp('4.8%'), borderRadius: wp('1%'), justifyContent: 'center', alignItems: 'center', backgroundColor: '#06244F',borderColor: 'white',borderWidth:1 }}>
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
    await fetchData();
    setRefreshing(false);
  }}
        />
        </View>
      )}    
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 60, // modal starts near top
    backgroundColor: 'rgba(0,0,0,0.3)' // translucent background
  }}>
    <View style={{
      width: '90%',
      backgroundColor: '#151515',
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color:'#ffffff' }}>
        Add Broker Pricing - {selectedIndent?.indent_number}
      </Text>

<View style={{borderWidth:1, borderColor:'darkgray', borderRadius:8, marginBottom:12, padding:hp('0.1%'),backgroundColor:'#313131'}}>
  <Picker
  selectedValue={brokerName}
  onValueChange={(item)=>setBrokerName(item)}
  dropdownIconColor='#989898'
  style={{
            height: hp('5%'),  // Reduce height
            color: '#989898',      // Set selected text color
            fontSize: wp('4.2%'),
            textAlign:'center',
            
          }}
  >
        <Picker.Item label="select Broker" value=''/>

    {brokerList.map((name, index) => (
      <Picker.Item key={index} label={name} value={name} />
    ))}

  </Picker>
</View>

      <TextInput
        placeholder="Vehicle / Ton Count"
        value={count}   
        onChangeText={(text) => {
            if (parseFloat(text) < 0) {
              Alert.alert('Please Enter Valid Number');
              return;
            }
            setCount(text);
          }}
          keyboardType="numeric"
         style={{borderWidth: 1,borderColor: '#ccc',borderRadius: 8,padding: hp('1%'),marginBottom: 12, backgroundColor:'#313131'}}
         placeholderTextColor={'#989898'}
      />
      <TextInput
        placeholder="Total Rate"
        value={rate}
 onChangeText={(text) => {
            if (parseFloat(text) < 0) {
              Alert.alert('Please Enter Valid Number');
              return;
            }
            setRate(text);
          }}        
        keyboardType="numeric"
        style={{borderWidth: 1,borderColor: '#ccc',borderRadius: 8,padding:hp('1%'),marginBottom: 12, backgroundColor:'#313131'}}
        placeholderTextColor={'#989898'}
        
        

      />

      {showError && (
        <Text style={{ color: 'red', marginBottom: 10 }}>
          ⚠️ Tonnage count cannot be less than required
        </Text>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('2%') }}>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text style={{ color: '#df4444', fontWeight: 'bold',fontSize:moderateScale(15)}}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleSubmit(selectedIndent)}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize:moderateScale(15) }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
  
  </View>

 

</View>

  )
}