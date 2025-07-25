import React, {useState, useEffect}from "react";
import {View, Text, SafeAreaView, ScrollView, TextInput, Pressable, TouchableOpacity, Dimensions, ActivityIndicator, Alert} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function CreateNewIndent(){
const [freightType, setFreightType] = useState('');
const [disclosureStatus, setDisclosureStatus] = useState('');
const [customers, setCustomers] = useState([]);
const [selectedCustomer, setSelectedCustomer] = useState('');
const [loading, setLoading] = useState(true);
const [vehicletypewithcapacity, setvehicletypewithcapacity] = useState('')
const [Vehicletype, setVehicletype] = useState([]);

const [IndentStartDate, setIndentStartDate] = useState('');
const [closingDate, setClosingDate] = useState('');
const [loadingDate, setLoadingDate] = useState('');
const [deliveryDate, setDeliveryDate] = useState('');
const [origin, setOrigin] = useState('');
const [destination, setDestination] = useState('');
const [numVehicles, setNumVehicles] = useState('');
const [totalAmount, setTotalAmount] = useState('');
const [advance, setAdvance] = useState('');
const [advanceAmount, setAdvanceAmount] = useState('');
const [targetRate, setTargetRate] = useState('');



  const API_URL_ForCustomerName = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/getSuppliers';
  const API_URL_ForVehicletypeCapacity = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/getVehicleType';

    useEffect(() => {
    axios.get(API_URL_ForCustomerName, {
  headers: {
    Authorization: `Bearer 4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8`,
  }})
      .then(response => {
              console.log('API response1:', response.data); // 👈 ADD THIS LINE

        setCustomers(response.data.data); 
        setLoading(false);
      })
      .catch(error => {
      console.error('Failed to fetch customers:', error.response?.data || error.message);
        setLoading(false);
      });
  }, []);
  

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
      console.error('Failed to fetch customers:', error.response?.data || error.message);
        setLoading(false);
      });
  }, []);

 const POST_API_ADDINDENT = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/createindent'

 const handleSubmit = () => {
  const payload = {
    customer_name: selectedCustomer,
    indent_start_date: IndentStartDate,
    indent_closing_date: closingDate,
    loading_date: loadingDate,
    expected_delivery_date: deliveryDate,
    origin: origin,
    destination: destination,
    vehicle_type: vehicletypewithcapacity,
    freight_type: freightType,
    number_of_vehicles: numVehicles,
    total_indent_amount: totalAmount,
    advance: advance,
    advance_amount: advanceAmount,
    is_disclosed: disclosureStatus,
    target_rate: targetRate,
  };

  axios.post(POST_API_ADDINDENT, payload, {
    headers: {
      Authorization: `Bearer 4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8`,
      'Content-Type': 'application/json',
    }
  })
  .then(response => {
    console.log('Indent created successfully:', response.data);
    Alert.alert('Indent created successfully!');
    // Clear the form here if needed
  })
  .catch(error => {
    console.error('Error creating indent:', error.response?.data || error.message);
    Alert.alert('Failed to create indent.');
  });
};


    return(
       <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 20, marginTop:18 }}>
        <View style={{ backgroundColor: 'darkblue', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 6, marginBottom: 20 }}>
          <Text style={{ color: 'white', fontSize: 16 }}>New Indent Details</Text>
        </View>
        <View style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5, padding: 10 }}>
          <Text style={{ fontWeight: '700', fontSize: 16 }}>Customer Name <Text style={{ color: 'red' }}>*</Text></Text>
          {loading ? (
        <ActivityIndicator size="large" color="navy" />
      ) : (
        <View style={{borderWidth: 1,borderColor: '#ccc',borderRadius: 8,}}>
          <Picker
            selectedValue={selectedCustomer}
            onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
            style={{height: 50,width: '100%',}}
          >
            <Picker.Item label="Select Customer" value="" />
            {customers.map((customer, index) => (
              <Picker.Item
                key={index}
                label={customer.customer_name}  // replace 'name' with your actual key
                value={customer.customer_name}
              />
            ))}
          </Picker>
        </View>
      )}    

      {selectedCustomer ? (
        <Text style={{marginTop: 10,fontSize: 16,color: 'green',}}>Selected: {selectedCustomer}</Text>
      ) : null}

          <Text style={{ fontWeight: '700', fontSize: 16 }}>Indent Start Date<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingHorizontal: 8 }}
            placeholderTextColor={"black"}
            placeholder='dd-mm-yyyy'
            // value={dob}
            // onPress={showDriverDobPicker}
            // onFocus={() => { Keyboard.dismiss() }}
          />

          <Text style={{ fontWeight: '700', fontSize: 16 }}>Indent Closing Date <Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingHorizontal: 8 }}
            placeholderTextColor={"black"}
            placeholder='dd-mm-yyyy'
            // value={dob}
            // onPress={showDriverDobPicker}
            // onFocus={() => { Keyboard.dismiss() }}
          />

          <Text style={{ fontWeight: '700', fontSize: 16 }}>Loading Date <Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingHorizontal: 8 }}
            placeholderTextColor={"black"}
            placeholder='dd-mm-yyyy'
            // value={dob}
            // onPress={showDriverDobPicker}
            // onFocus={() => { Keyboard.dismiss() }}
          />

          <Text style={{ fontWeight: '700', fontSize: 16 }}>Expected Delivery Date <Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingHorizontal: 8 }}
            placeholderTextColor={"black"}
            placeholder='dd-mm-yyyy'
            // value={dob}
            // onPress={showDriverDobPicker}
            // onFocus={() => { Keyboard.dismiss() }}
          />

          {/* <DateTimePickerModal
            isVisible={isDriverDobPickerVisible}
            mode='date'
            onConfirm={handleDriverDobConfirm}
            onCancel={hideDriverDobPicker}
          /> */}

          <Text style={{ fontWeight: '700', fontSize: 16 }}>Origin <Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
            placeholder='Starting Point'
            // value={driverName}
            // onChangeText={handleDriverName}
            maxLength={60}
          />
           <Text style={{ fontWeight: '700', fontSize: 16 }}>Destination<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
            placeholder='End Point'
            // value={driverName}
            // onChangeText={handleDriverName}
            maxLength={60}
          />

           <Text style={{ fontWeight: '700', fontSize: 16 }}>Vehicle Type with capacity <Text style={{ color: 'red' }}>*</Text></Text>
           {loading ? (
        <ActivityIndicator size="large" color="navy" />
      ) : (
        <View style={{borderWidth: 1,borderColor: '#ccc',borderRadius: 8,}}>
          <Picker
            selectedValue={vehicletypewithcapacity}
            onValueChange={(itemValue) => setvehicletypewithcapacity(itemValue)}
            style={{height: 50,width: '100%',}}
          >
            <Picker.Item label="Select Vehicle type" value="" />
            {Vehicletype.map((customer, index) => (
              <Picker.Item
                key={index}
                label={customer.vehicle_type}  // replace 'name' with your actual key
                value={customer.vehicle_type}
              />
            ))}
          </Picker>
        </View>
      )}    

      {vehicletypewithcapacity ? (
        <Text style={{marginTop: 10,fontSize: 16,color: 'green',}}>Selected: {vehicletypewithcapacity}</Text>
      ) : null}

           <Text style={{ fontWeight: '700', fontSize: 16 }}>Freight Type<Text style={{ color: 'red' }}>*</Text></Text>
           <View style={{borderWidth: 1,borderColor: '#aaa',borderRadius: 8,}}>
        <Picker
          selectedValue={freightType}
          onValueChange={(itemValue) => setFreightType(itemValue)}
          style={{ height: 50,width: '100%',}}
        >
          <Picker.Item label="Select Freight Type" value="" />
          <Picker.Item label="Per Vehicle" value="1" />
          <Picker.Item label="Per Ton" value="2" />
        </Picker>
      </View>
      {freightType ? (
        <Text style={{marginTop: 10,fontSize: 16,
color: 'green',}}>
          Selected: {freightType === '1' ? 'Per Vehicle' : 'Per Ton'}
        </Text>
      ) : null}

          
      <Text style={{ fontWeight: '700', fontSize: 16 }}>Number of Vehicles<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
            placeholder=' '
            // value={driverName}
            // onChangeText={handleDriverName}
            maxLength={60}
          />

            <Text style={{ fontWeight: '700', fontSize: 16 }}>Total Indent Amount<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
            placeholder=' '
            // value={driverName}
            // onChangeText={handleDriverName}
            maxLength={60}
          />
          
             <Text style={{ fontWeight: '700', fontSize: 16 }}>Advance<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
            placeholder=' '
            // value={driverName}
            // onChangeText={handleDriverName}
            maxLength={60}
          />

           <Text style={{ fontWeight: '700', fontSize: 16 }}>Advance Amount<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
            placeholder=' '
            // value={driverName}
            // onChangeText={handleDriverName}
            maxLength={60}
          />

           <Text style={{ fontWeight: '700', fontSize: 16 }}>Is Disclosed<Text style={{ color: 'red' }}>*</Text></Text>
          <View style={{borderWidth: 1,borderColor: '#aaa',borderRadius: 8,}}>
        <Picker
          selectedValue={disclosureStatus}
          onValueChange={(itemValue) => setDisclosureStatus(itemValue)}
          style={{ height: 50,width: '100%',}}
        >
          <Picker.Item label="Select" value="" />
          <Picker.Item label="Disclosed" value="0" />
          <Picker.Item label="Not Disclosed" value="1" />
        </Picker>
      </View>
      {disclosureStatus ? (
        <Text style={{marginTop: 10,fontSize: 16,
color: 'green',}}>
          Selected: {disclosureStatus === '0' ? 'Disclosed' : 'Not Disclosed'}
        </Text>
      ) : null}
         
             <Text style={{ fontWeight: '700', fontSize: 16 }}>Target Rate (Per Ton/Vehicle)<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
            placeholder=' '
            // value={driverName}
            // onChangeText={handleDriverName}
            maxLength={60}
          />
        
          <Pressable  onPress={handleSubmit}>
            <View style={{ backgroundColor: '#0b4b85', height: 40, borderRadius: 6, width: '40%', justifyContent: 'center', alignSelf: 'center' }}>
              <Text style={{ alignSelf: 'center', color: 'white', fontWeight: '600', fontSize: 16 }}>Add Indent</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
    )
}