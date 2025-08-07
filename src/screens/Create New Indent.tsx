import React, {useState, useEffect}from "react";
import {View, Text, SafeAreaView, TextInput, Pressable, TouchableOpacity, ActivityIndicator, Alert, FlatList, Modal, ImageBackground} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function CreateNewIndent(){

const navigation = useNavigation();
const [freightType, setFreightType] = useState('');
const [disclosureStatus, setDisclosureStatus] = useState('');
const [customers, setCustomers] = useState([]);
const [selectedCustomer, setSelectedCustomer] = useState('');
const [loading, setLoading] = useState(true);
const [vehicletypewithcapacity, setvehicletypewithcapacity] = useState('')
const [Vehicletype, setVehicletype] = useState([]);
const [IndentStartDate, setIndentStartDate] = useState(new Date());
const [open, setOpen] = useState(false);
const [closingDate, setClosingDate] = useState(new Date());
const [openclose, setOpenclose] = useState(false);
const [loadingDate, setLoadingDate] = useState(new Date());
const [openloading, setOpenloading] = useState(false);
const [deliveryDate, setDeliveryDate] = useState(new Date());
const [opendelivery, setOpendelivery] = useState(false);
const [origin, setOrigin] = useState('');
const [destination, setDestination] = useState('');
const [numVehicles, setNumVehicles] = useState('');
const [totalAmount, setTotalAmount] = useState('');
const [advance, setAdvance] = useState('');
const [advanceAmount, setAdvanceAmount] = useState('');
const [targetRate, setTargetRate] = useState('');
const [tonnageCount, setTonnageCount] = useState('');
const [perVehicleRate, setPerVehicleRate] = useState('');
const [perTonRate, setPerTonRate] = useState('');
const [userId, setUserId] = useState('');
const [customerModalVisible, setCustomerModalVisible] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [filteredCustomers, setFilteredCustomers] = useState([]);
const [originDropdownOpen, setOriginDropdownOpen] = useState(false);
const [destinationDropdownOpen, setDestinationDropdownOpen] = useState(false)

useEffect(() => {
   const fetchUserId = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserId(parsed.id); 
    }
  };
  fetchUserId();
}, []);

useEffect(() => {
  if (advance !== '' && totalAmount !== '') {
    const percentage = parseFloat(advance);
    const total = parseFloat(totalAmount);
  if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      Alert.alert('Invalid Advance %', 'Please enter a valid percentage between 0 and 100.');
      setAdvanceAmount('');
      return;
}
const calculatedAdvanceAmount = (percentage / 100) * total;
    setAdvanceAmount(calculatedAdvanceAmount.toFixed(2).toString());
  } else {
    setAdvanceAmount('');
  }
}, [advance, totalAmount]);

useEffect(() => {
  if (freightType === '1') {
    const total = parseFloat(numVehicles || 0) * parseFloat(perVehicleRate || 0);
    setTotalAmount(total.toString());
  } else if (freightType === '2') {
    const total = parseFloat(tonnageCount || 0) * parseFloat(perTonRate || 0);
    setTotalAmount(total.toString());
  }
}, [freightType, numVehicles, perVehicleRate, tonnageCount, perTonRate]);

  const API_URL_ForCustomerName = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/getSuppliers';
  const API_URL_ForVehicletypeCapacity = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/getVehicleType';
  const POST_API_ADDINDENT = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/createindent'

useEffect(() => {
    axios.get(API_URL_ForCustomerName, {
  headers: {
    Authorization: `Bearer 4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8`,
  }})
      .then(response => {
              console.log('API response1:', response.data); 

        setCustomers(response.data.data); 
                setFilteredCustomers(response.data.data);

        setLoading(false);
    })
      .catch(error => {
      console.error('Failed to fetch customers:', error.response?.data || error.message);
        setLoading(false);
      });
    
  }, []);

const handleSearch = text => {
  setSearchQuery(text);
  const filtered = customers.filter(item =>
    item.customer_name?.toLowerCase().startsWith(text.toLowerCase())
  );
  setFilteredCustomers(filtered);
};
//const API_URL_ForVehicletypeCapacity = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/getVehicleType';
    useEffect(() => {
    axios.get(API_URL_ForVehicletypeCapacity, {
  headers: {
    Authorization: `Bearer 4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8`,
  }})
      .then(response => {
              console.log('API response2:', response.data); 

        setVehicletype(response.data.data); 
        setLoading(false);
      })
      .catch(error => {
      console.error('Failed to fetch vehcles:', error.response?.data || error.message);
        setLoading(false);
      });
  }, []);
//  const POST_API_ADDINDENT = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/createindent'
 const handleSubmit = () => {
    if (
    !selectedCustomer ||
    !origin ||
    !destination ||
    !vehicletypewithcapacity ||
    !freightType || 
    !totalAmount ||
    !advance ||
    !advanceAmount ||
    !disclosureStatus ||
    !targetRate||
    !IndentStartDate ||
    !closingDate||
    !loadingDate ||
    !deliveryDate||
    !userId
  ) {
    Alert.alert('Validation Error', 'Please fill all required fields.');
    return;
  }
  const payload = {
    customer_name: selectedCustomer?.id, 
    indent_start_date: moment(IndentStartDate).format('DD-MM-YYYY'), 
    indent_last_date: moment(closingDate).format('DD-MM-YYYY'),
    loading_date: moment(loadingDate).format('DD-MM-YYYY'),
    expected_delivery_date: moment(deliveryDate).format('DD-MM-YYYY'),
    origin: origin,
    destination: destination,
    vehicle_type: vehicletypewithcapacity,
    freight_type: freightType,
    vehicle_count: freightType === '1' ? numVehicles : tonnageCount,
    per_vehicle_rate: freightType === '1' ? perVehicleRate : perTonRate,
    total_indent_amount: totalAmount,
    advance_percent: advance,
    advance_amount: advanceAmount,
    is_disclosed: disclosureStatus,
    target_rate: targetRate,
    user_id: userId
  };
    console.log('Payload being sent:', payload); 
 
  axios.post(POST_API_ADDINDENT, payload, {
    headers: {
      Authorization: `Bearer 4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8`,
      'Content-Type': 'application/json',
    }
  })
  .then(response => {
    console.log('Indent created successfully:', response.data);
    Alert.alert('Success', 'Indent created successfully!',[
      {
      text: 'OK',
      onPress: () => navigation.replace('MainApp', { screen: 'KBR Indents' }),
    }
    ]);
  })
  .catch(error => {
    console.error('Error creating indent:', error.response?.data || error.message);
    Alert.alert('Failed to create indent.');
  });
};
  return(
     <ImageBackground style={{ flex: 1 }} resizeMode='cover' 
      source={require('../assets/image/background.png')}    
    >
     <KeyboardAwareScrollView
      style={{ flex: 1, }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={20}
      contentContainerStyle={{ padding: 16 }}     
    >
        <View style={{ backgroundColor: '#001834', height: hp('5%'), borderWidth: scale(1), borderColor: '#f5fbfb',justifyContent: 'center', alignItems: 'center', borderRadius: moderateScale(6), marginBottom: hp('2%') }}>
          <Text style={{ color: '#f5fbfb', fontSize: moderateScale(16), fontWeight:'600' }}>New Indent Details</Text>
        </View>
        <View style={{ borderWidth: scale(1), borderColor: 'grey', borderRadius:moderateScale(5), padding: moderateScale(10), }}>
          <Text style={{ fontWeight: '700', fontSize:  moderateScale(14),color:'#f5fbfb' }}>Customer Name <Text style={{ color: '#df4444' }}>*</Text></Text>
          <TouchableOpacity
  onPress={() => setCustomerModalVisible(true)}

  style={{ borderWidth: 1, padding: 10, marginBottom: hp('0.5%'), borderRadius: moderateScale(5),backgroundColor:'#00457c', }}
>
  <Text style={{color:'#fdfdfd'}}>{selectedCustomer?.customer_name || 'Select Customer'}</Text>
</TouchableOpacity>
<Modal visible={customerModalVisible} animationType="slide">
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <TextInput
      placeholder="Search Customer"
      value={searchQuery}
      onChangeText={handleSearch}
      
      style={{
        borderWidth: scale(1),
        borderColor: '#ccc',
        margin: moderateScale(10),
        padding: moderateScale(10),
        borderRadius: moderateScale(10),
      }}
    />

    {filteredCustomers.length === 0 ? (
      <Text style={{ textAlign: 'center', marginTop: hp('1%') }}>No data found</Text>
    ) : (
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCustomer(item);
              setCustomerModalVisible(false);
            }}
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            }}
          >
            <Text>{item.customer_name}</Text>
          </TouchableOpacity>
        )}
      />
    )}

    <TouchableOpacity
      onPress={() => setCustomerModalVisible(false)}
      style={{
        padding: moderateScale(10),
        margin: moderateScale(10),
        backgroundColor: 'navy',
        alignItems: 'center',
        borderRadius:moderateScale(5),
      }}
    >
      <Text style={{color:'white', fontWeight:'bold'}}>Close</Text>
    </TouchableOpacity>
  </SafeAreaView>
</Modal>

         
         
         
         
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <View style={{ width: '48%' }}>
    <Text style={{ fontWeight: '700', fontSize: moderateScale(14), marginTop:hp('1%'),color:'#f5fbfb' }}>Indent Start Date<Text style={{ color: '#df4444' }}>*</Text></Text>  
      <TouchableOpacity onPress={() => setOpen(true)}
        style={{borderWidth: moderateScale(1),borderColor: 'black',padding:9,borderRadius:moderateScale(5),marginTop:hp('1%'),marginBottom:hp('1%'),backgroundColor:'#00457c'}}>
          <Text style={{color:'#fdfdfd'}}>{moment(IndentStartDate).format('DD-MM-YYYY')}</Text>
      </TouchableOpacity>
</View>
  <DatePicker
    modal
    open={open}
    date={IndentStartDate}
    mode="date"
    onConfirm={(selectedDate) => {
    setOpen(false);
    setIndentStartDate(selectedDate);
    }}
    onCancel={() => {setOpen(false)}} />
 <View style={{ width: '48%' }}>
  <Text style={{ fontWeight: '700', fontSize: moderateScale(14),marginTop:hp('1%'),color:'#f5fbfb' }}>Indent Close Date <Text style={{ color: '#df4444' }}>*</Text></Text>
  <TouchableOpacity onPress={() => setOpenclose(true)}
  style={{borderWidth: moderateScale(1),borderColor: 'black',padding:9,borderRadius:moderateScale(5),marginTop:hp('1%'),marginBottom:hp('1%'),backgroundColor:'#00457c'}}>
  <Text style={{color:'#fdfdfd'}}>{moment(closingDate).format('DD-MM-YYYY')}</Text>
  </TouchableOpacity>
  </View>
</View>
  <DatePicker
   modal
   open={openclose}
   date={closingDate}
   mode="date"
   onConfirm={(selectedDate) => {
   setOpenclose(false);
   setClosingDate(selectedDate);
   }}
   onCancel={() => {setOpenclose(false)}}/>
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <View style={{ width: '46%' }}>
  <Text style={{ fontWeight: '700', fontSize: moderateScale(14),marginTop:hp('1%'),color:'#f5fbfb'  }}>Loading Date <Text style={{ color: '#df4444' }}>*</Text></Text>
    <TouchableOpacity onPress={() => setOpenloading(true)}
      style={{borderWidth:moderateScale(1),borderColor: 'black',padding:9,borderRadius:moderateScale(5),marginTop:hp('1%'),marginBottom:hp('1%'),backgroundColor:'#00457c'}}>
        <Text style={{color:'#fdfdfd'}}>{moment(loadingDate).format('DD-MM-YYYY')}</Text>
      </TouchableOpacity>
    </View>
  <DatePicker
    modal
    open={openloading}
    date={loadingDate}
    mode="date"
    onConfirm={(selectedDate) => {
    setOpenloading(false);
    setLoadingDate(selectedDate);
    }}
    onCancel={() => {setOpenloading(false)}}/>      
 <View style={{ width: '51%' }}>
  <Text style={{ fontWeight: '700', fontSize: moderateScale(14),marginTop:hp('1%'),color:'#f5fbfb'  }}>Exp. Delivery Date <Text style={{ color: '#df4444' }}>*</Text></Text>
  <TouchableOpacity onPress={() => setOpendelivery(true)}
      style={{borderWidth:moderateScale(1),borderColor: 'black',padding:9,borderRadius:moderateScale(5),marginTop:hp('1%'),marginBottom:hp('1%'), backgroundColor:'#00457c'}}>
    <Text style={{color:'#fdfdfd'}}>{moment(deliveryDate).format('DD-MM-YYYY')}</Text>
  </TouchableOpacity>
</View>
</View>
 <DatePicker
  modal
  open={opendelivery}
  date={deliveryDate}
  mode="date"
                  onConfirm={(selectedDate) => {
                    setOpendelivery(false);
                    setDeliveryDate(selectedDate);
                  }}
                  onCancel={() => {setOpendelivery(false)}}
                />
  <View style={{ flexDirection: 'row', justifyContent: 'space-between',  }}>
  <View style={{ width: '49%', zIndex: 10}}>
          <Text style={{ fontWeight: '700', fontSize: moderateScale(14),color:'#f5fbfb' }}>Origin <Text style={{ color: '#df4444' }}>*</Text></Text>   
          {originDropdownOpen && (
  <View
    pointerEvents="box-only"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'transparent',
      zIndex: 9, 
    }}
  />
)}           
    <View style={{ zIndex: 10, elevation: 10 }}>
     <GooglePlacesAutocomplete
  placeholder="Origin"
  fetchDetails={true}
  enablePoweredByContainer={false}
  onPress={(data, details = null) => {
    const address = details?.formatted_address || data.description;
    setOrigin(address);

  }}
   
  textInputProps={{
    value: origin,
    onChangeText: setOrigin,
    placeholderTextColor:'#fdfdfd'
    
  }}

  
  query={{
    key: 'AIzaSyD9q-QzM7KXhPS110LUa9KMqD06l35oLdg',
    language: 'en',
  }}
        debounce={300}
        minLength={2}
  styles={{
    container: { flex: 0 },textInputContainer: {backgroundColor: 'transparent',borderTopWidth: 0,borderBottomWidth: 0,marginBottom: hp('1%'),},
    textInput: {marginLeft: wp('0.5%'),marginRight: wp('0.5%'),height: hp('4.2%'),borderWidth: moderateScale(1),borderColor: 'black',borderRadius: moderateScale(6),paddingHorizontal: 20,fontSize: moderateScale(12),backgroundColor: '#00457c', color:'#f5fbfb'},
    listView: {zIndex:1000,position: 'absolute',top: hp('6%'),backgroundColor: '#fff',elevation: 5,width: wp('100%')},
    row: {backgroundColor: '#fff',padding: wp('1%'),flexDirection: 'row'},
    description: {color: '#000'}}}
  />
{origin !== '' && (
    <TouchableOpacity
      onPress={() => {
        setOrigin('');
        setOriginDropdownOpen(false);
      }}
      style={{position: 'absolute',right: 10,top: 15,zIndex: 1001}}
    >
      <Text style={{ fontSize: 12 , color:'red'}}>❌</Text>
    </TouchableOpacity>
  )}
</View>
          </View>
<View style={{ width: '49%',zIndex: 5, elevation:10}}>
  <Text style={{ fontWeight: '700', fontSize: moderateScale(14),color:'#f5fbfb' }}>Destination<Text style={{ color: '#df4444' }}>*</Text></Text>
    <View style={{ zIndex: 10, elevation: 10 }}>
      {destinationDropdownOpen && (
  <View
    pointerEvents="box-only"
    style={{position: 'absolute',top: 0,left: 0,right: 0,bottom: 0,backgroundColor: 'transparent',zIndex: 9,}}
  />
)} 
   <GooglePlacesAutocomplete
     placeholder="Destination"
          fetchDetails={true}
        enablePoweredByContainer={false}
          query={{
            key: 'AIzaSyD9q-QzM7KXhPS110LUa9KMqD06l35oLdg', 
            language: 'en', 
          }}
          onPress={(data, details = null) => {
    const address = details?.formatted_address || data.description;
    setDestination(address);

  }}
  textInputProps={{
    value: destination,
    onChangeText: (text) => setDestination(text),
    placeholderTextColor:'#fdfdfd' 
  }}
        debounce={300}
        minLength={2}
          styles={{
  container: {
    flex: 0,
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginBottom: hp('1%')
  },
  textInput: {
    marginLeft:wp('0.5%'),
    marginRight:wp('0.5%'),
    height: hp('4.2%'),
    borderWidth: moderateScale(1),
    borderColor: 'black',
    borderRadius: moderateScale(6),
    paddingHorizontal: 20,
    fontSize: moderateScale(12),
    backgroundColor: '#00457c',
    color:'#f5fbfb'
  },
  listView: {
    position: 'absolute',
    top: hp('6%'),               
    backgroundColor: '#fff',
    elevation: 5,
    zIndex: 1000,
    width: wp('100%'),  
  },
  row: {
    backgroundColor: '#fff',
    padding: wp('1%'),
    flexDirection: 'row',
  },
  description: {
    color: '#000',
  },
}}
/>
{destination !== '' && (
    <TouchableOpacity
      onPress={() => {
        setDestination('');
        setDestinationDropdownOpen(false);
      }}
      style={{
        position: 'absolute',
      right: wp('2.5%'),  // ~10px
top: hp('1.8%'),
        zIndex: 1001,
      }}
    >
      <Text style={{ fontSize: hp('1.5%'), color:'red'}}>❌</Text>
    </TouchableOpacity>
  )}
             </View>

     </View>
     
</View>
           <Text style={{ fontWeight: '700', fontSize: moderateScale(14),marginTop:hp('1%'),color:'#f5fbfb'}}>Vehicle Type with capacity <Text style={{ color: '#df4444' }}>*</Text></Text>
           {loading ? (
        <ActivityIndicator size="large" color="navy" />
      ) : (
        <View style={{borderWidth: moderateScale(1),marginTop:hp('0.2%'),borderColor: 'black',borderRadius: wp('2%'), marginBottom: hp('2%'), height: hp('5%'),justifyContent:'center',backgroundColor:'#00457c'}}>
          <Picker
            selectedValue={vehicletypewithcapacity}
            dropdownIconColor={'#fdfdfd'}
            onValueChange={(itemValue) => setvehicletypewithcapacity(itemValue)}
            style={{height: hp('5.9%'),width: '100%', color:'#fdfdfd'}}
          >
            <Picker.Item label="Select Vehicle type" value="" />
            {Vehicletype.map((customer, index) => (
              <Picker.Item
                key={index}
                label={customer.vehicle_type}  
                value={customer.vehicle_type}
              />
            ))}
          </Picker>
        </View>
      )}    
      {/* {vehicletypewithcapacity ? (
        <Text style={{marginTop:1,fontSize: 14,color: 'green',marginVertical:1, marginBottom:5}}>Selected: {vehicletypewithcapacity}</Text>
      ) : null} */}

           <Text style={{ fontWeight: '600', fontSize: moderateScale(14), marginBottom: hp('0.1%'),color:'#f5fbfb'}}>Freight Type<Text style={{ color: '#df4444' }}>*</Text></Text>
           <View style={{borderWidth:moderateScale(1),borderColor: 'black',borderRadius: 8, marginBottom:hp('1%'), height:hp('5%'),marginTop:hp('1%'),justifyContent:'center',backgroundColor:'#00457c' }}>
        <Picker
          selectedValue={freightType}
          dropdownIconColor={'#fdfdfd'}
          onValueChange={(itemValue) => setFreightType(itemValue)}
          style={{ height: hp('5.9%'),width: '100%',color:'#fdfdfd'}}
        >
          <Picker.Item label="Select Freight Type" value="" />
          <Picker.Item label="Per Vehicle" value="1" />
          <Picker.Item label="Per Ton" value="2" />
        </Picker>
      </View>
      {/* {freightType ? (
        <Text style={{marginTop:hp('0.1%'),fontSize: 10,
color: 'green', marginBottom:20}}>
          Selected: {freightType === '1' ? 'Per Vehicle' : 'Per Ton'}
        </Text>
      ) : null} */}

          
      {freightType === '1' && (
  <>
    <Text style={{ fontWeight: '700', fontSize: moderateScale(14),color:'#f5fbfb' }}>Number of Vehicles<Text style={{ color: '#df4444' }}>*</Text></Text>
    <TextInput
      style={{ borderWidth: 1,borderRadius: wp('1.3%'),height: hp('4.8%'),marginTop: hp('0.7%'),marginBottom: hp('2%'),paddingLeft: wp('2%'),backgroundColor:'#00457c', color:'#fdfdfd'}}
      placeholder='Enter number of vehicles'
      value={numVehicles}
      placeholderTextColor={'#fdfdfd'}
      onChangeText={(text) => {
    if (parseFloat(text) < 0) {
      Alert.alert('Number of vehicles must be 0 or more');
      return;
    }
    setNumVehicles(text);
  }}
  keyboardType="numeric"
    />

    <Text style={{ fontWeight: '700', fontSize:  moderateScale(14) ,color:'#f5fbfb'  }}>Per Vehicle Rate (customer)<Text style={{ color: '#df4444' }}>*</Text></Text>
    <TextInput
      style={{ borderWidth: 1,borderRadius: wp('1.3%'),height: hp('4.8%'),marginTop: hp('0.7%'),marginBottom: hp('2.4%'),paddingLeft: wp('2%'),backgroundColor:'#00457c', color:'#fdfdfd'}}
      placeholder='Enter per vehicle rate'
      value={perVehicleRate}
      placeholderTextColor={'#fdfdfd'}
      onChangeText={(text) => {
    if (parseFloat(text) < 0) {
      Alert.alert('Rate should be 0 or more');
      return;
    }
    setPerVehicleRate(text);
  }}
     keyboardType="numeric"
      
    />
  </>
)}

{freightType === '2' && (
  <>
    <Text style={{ fontWeight: '700', fontSize:  moderateScale(14),color:'#f5fbfb'}}>Tonnage Count<Text style={{ color: '#df4444' }}>*</Text></Text>
    <TextInput
      style={{ borderWidth: 1,borderRadius: wp('1.3%'),height: hp('4.8%'),marginTop: hp('0.7%'),marginBottom: hp('2%'),paddingLeft: wp('2%'),backgroundColor:'#00457c', color:'#fdfdfd'}}
      placeholder='Enter total tonnage'
      value={tonnageCount}
      placeholderTextColor={'#fdfdfd'}
      onChangeText={(text) => {
    if (parseFloat(text) < 0) {
      Alert.alert('Tonnage must be 0 or more');
      return;
    }
    setTonnageCount(text);
  }}
   
    />

    <Text style={{ fontWeight: '700', fontSize:  moderateScale(14),color:'#f5fbfb'}}>Per Ton Rate<Text style={{ color: '#df4444' }}>*</Text></Text>
    <TextInput
      style={{ borderWidth: 1,borderRadius: wp('1.3%'),height: hp('4.8%'),marginTop: hp('0.7%'),marginBottom: hp('2%'),paddingLeft: wp('2%'),backgroundColor:'#00457c', color:'#fdfdfd'}}
      placeholder='Enter per ton rate'
      value={perTonRate}
      placeholderTextColor={'#fdfdfd'}
      onChangeText={(text) => {
    if (parseFloat(text) < 0) {
      Alert.alert('Rate should be 0 or more');
      return;
    }
    setPerTonRate(text);
  }}
     keyboardType="numeric"
    />
  </>
)}
   <View style={{flexDirection:'row', justifyContent:'space-between'}}>
    <View style={{ width: '49%' }}>
             <Text style={{ fontWeight: '700', fontSize: moderateScale(14),color:'#f5fbfb' }}>Total Indent Amount<Text style={{ color: '#df4444' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: moderateScale(1), borderRadius: moderateScale(5), height: verticalScale(30), marginTop:  hp('1%'), marginBottom:  hp('1.5%'), paddingLeft:wp('2%'),color:'#fdfdfd',backgroundColor:'#00457c'  }}
            placeholder='Total Amount '
            value={totalAmount}
            editable={false} 
            placeholderTextColor={'#f5fbfb'}
         
          />
         </View>
         <View style={{ width: '49%' }}>
             <Text style={{ fontWeight: '700', fontSize: moderateScale(14),color:'#f5fbfb'}}>Advance %<Text style={{ color: '#df4444' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: moderateScale(1), borderRadius: moderateScale(5), height: verticalScale(30), marginTop: hp('1%'), marginBottom: hp('1.5%'), paddingLeft:wp('2%'),color:'#fdfdfd',backgroundColor:'#00457c'  }}
            placeholder="Enter %"
            value={advance}
            onChangeText={setAdvance}
            keyboardType="numeric"
            maxLength={3}
                        placeholderTextColor={'#fdfdfd'}

          
          />
</View> 
</View>

<View style={{flexDirection:'row', justifyContent:'space-between'}}> 
  <View style={{width:'49%'}}>
           <Text style={{ fontWeight: '700', fontSize:  moderateScale(14),color:'#f5fbfb'}}>Advance Amount<Text style={{ color: '#df4444' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: scale(1),borderColor: '#001834', borderRadius:moderateScale(5), height: verticalScale(30), marginTop: hp('1%'), marginBottom: hp('1.5%'), paddingLeft:wp('2%'), color:'#fdfdfd',backgroundColor:'#00457c'  }}
            placeholder="Advance Amount"
            value={advanceAmount}
            editable={false}
            onChangeText={setAdvanceAmount}
            placeholderTextColor={'#fdfdfd'}

          />

</View>
<View style={{width:'49%'}}>
           <Text style={{ fontWeight: '700', fontSize:  moderateScale(14),color:'#f5fbfb'}}>Is Disclosed<Text style={{ color: '#df4444' }}>*</Text></Text>
          <View style={{borderWidth: scale(1),borderColor: '#001834',borderRadius: moderateScale(6),height:verticalScale(30), marginTop:hp('1%'), justifyContent:'center',backgroundColor:'#00457c' }}>
        <Picker
          selectedValue={disclosureStatus}
                    dropdownIconColor={'#fdfdfd'}

          onValueChange={(itemValue) => setDisclosureStatus(itemValue)}
          style={{ height:hp('5%'),width: '100%', color:'#fdfdfd'}}
        >
          <Picker.Item label="Select" value="" />
          <Picker.Item label="Disclosed" value="0" />
          <Picker.Item label="Not Disclosed" value="1" />
        </Picker>
      </View>
      {/* {disclosureStatus ? (
        <Text style={{marginTop:hp('0.5%'),fontSize:moderateScale(10),color: 'green', }}>
          Select: {disclosureStatus === '0' ? 'Disclosed' : 'Not Disclosed'}
        </Text>
      ) : null} */}
      </View>
     </View>    
             <Text style={{ fontWeight: '700', fontSize: moderateScale(14),color:'#f5fbfb'}}>Target Rate (Per Ton/Vehicle)<Text style={{ color: '#df4444' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: scale(1), borderRadius: moderateScale(5), height:verticalScale(30), marginTop: hp('1%'), marginBottom: verticalScale(20), paddingLeft: scale(8), backgroundColor:'#00457c', color:'#fdfdfd'  }}
            placeholder='Enter Rate'
            value={targetRate}
            onChangeText={setTargetRate}
            keyboardType="numeric"
            placeholderTextColor={'#fdfdfd'}
          />
        
          <Pressable  onPress={handleSubmit}>
            <View style={{ backgroundColor: '#001834', height:verticalScale(30), borderRadius: moderateScale(5), width: '60%', justifyContent: 'center', alignSelf: 'center',marginBottom: hp('8%'), borderWidth: moderateScale(1), borderColor:'#f5fbfb'}}>
              <Text style={{ alignSelf: 'center', color:'#f5fbfb', fontWeight: '600', fontSize: moderateScale(15) }}>Add Indent</Text>
            </View>
          </Pressable>
        </View>

    </KeyboardAwareScrollView>
</ImageBackground>
    )
}