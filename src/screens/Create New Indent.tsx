import React, {useState, useEffect}from "react";
import {View, Text, SafeAreaView, ScrollView, TextInput, Pressable, TouchableOpacity, Dimensions, ActivityIndicator, Alert} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';


export default function CreateNewIndent(){
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
    // Per Vehicle calculation
    const total = parseFloat(numVehicles || 0) * parseFloat(perVehicleRate || 0);
    setTotalAmount(total.toString());
  } else if (freightType === '2') {
    // Per Ton calculation
    const total = parseFloat(tonnageCount || 0) * parseFloat(perTonRate || 0);
    setTotalAmount(total.toString());
  }
}, [freightType, numVehicles, perVehicleRate, tonnageCount, perTonRate]);


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
    if (
    !selectedCustomer ||
    !origin ||
    !destination ||
    !vehicletypewithcapacity ||
    !freightType ||
    !numVehicles ||
    !totalAmount ||
    !advance ||
    !advanceAmount ||
    !disclosureStatus ||
    !targetRate
  ) {
    Alert.alert('Validation Error', 'Please fill all required fields.');
    return;
  }
  const payload = {
    customer_name: selectedCustomer,
    indent_start_date: moment(IndentStartDate).format('DD-MM-YYYY'), 
    indent_closing_date: moment(closingDate).format('DD-MM-YYYY'),
    loading_date: moment(loadingDate).format('DD-MM-YYYY'),
    expected_delivery_date: moment(deliveryDate).format('DD-MM-YYYY'),
    origin: origin,
    destination: destination,
    vehicle_type: vehicletypewithcapacity,
    freight_type: freightType,
    number_of_vehicles: freightType === '1' ? numVehicles : '',
    tonnage: freightType === '2' ? tonnageCount : '',
    per_vehicle_rate: freightType === '1' ? perVehicleRate : '',
    per_ton_rate: freightType === '2' ? perTonRate : '',
    total_indent_amount: totalAmount,
    advance: advance,
    advance_amount: advanceAmount,
    is_disclosed: disclosureStatus,
    target_rate: targetRate,
  };
    console.log('Payload being sent:', payload); // ✅ Log payload here


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
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 20, marginTop:10 }}>
        <View style={{ backgroundColor: 'darkblue', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 6, marginBottom: 20 }}>
          <Text style={{ color: 'white', fontSize: 16 }}>New Indent Details</Text>
        </View>
        <View style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5, padding: 10 }}>
          <Text style={{ fontWeight: '700', fontSize: 16 }}>Customer Name <Text style={{ color: 'red' }}>*</Text></Text>
          {loading ? (
        <ActivityIndicator size="large" color="navy" />
      ) : (
        <View style={{borderWidth: 1,borderColor: 'black',borderRadius: 8,}}>
          <Picker
            selectedValue={selectedCustomer}
            onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
            style={{height:52,width: '100%',}}
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
        <Text style={{marginTop: 10,fontSize: 15,color: 'green',}}>Selected: {selectedCustomer}</Text>
      ) : null}

      
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <View style={{ width: '48%' }}>

          <Text style={{ fontWeight: '700', fontSize: 16, marginTop:12}}>Indent Start Date<Text style={{ color: 'red' }}>*</Text></Text>  
            <TouchableOpacity
                  onPress={() => setOpen(true)}
                  style={{borderWidth: 1,borderColor: 'black',padding:9,borderRadius: 5,marginTop:6,marginBottom:20}}
                 >
                  <Text>{moment(IndentStartDate).format('DD-MM-YYYY')}</Text>
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
                  onCancel={() => {setOpen(false)}}
                />
           <View style={{ width: '48%' }}>
    
          <Text style={{ fontWeight: '700', fontSize: 16,marginTop:12 }}>Indent Closing Date <Text style={{ color: 'red' }}>*</Text></Text>
           <TouchableOpacity
                  onPress={() => setOpenclose(true)}
                  style={{borderWidth: 1,borderColor: 'black',padding:9,borderRadius: 5,marginTop:6,marginBottom:20}}
                 >
                  <Text>{moment(closingDate).format('DD-MM-YYYY')}</Text>
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
                  onCancel={() => {setOpenclose(false)}}
                />
        
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <View style={{ width: '46%' }}>
          <Text style={{ fontWeight: '700', fontSize: 16 }}>Loading Date <Text style={{ color: 'red' }}>*</Text></Text>
          <TouchableOpacity
                  onPress={() => setOpenloading(true)}
                  style={{borderWidth: 1,borderColor: 'black',padding:9,borderRadius: 5,marginTop:6,marginBottom:20}}
                 >
                  <Text>{moment(loadingDate).format('DD-MM-YYYY')}</Text>
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
                  onCancel={() => {setOpenloading(false)}}
                />
        
 <View style={{ width: '52%' }}>
          <Text style={{ fontWeight: '700', fontSize: 16 }}>Expected Delivery Date <Text style={{ color: 'red' }}>*</Text></Text>
          <TouchableOpacity
                  onPress={() => setOpendelivery(true)}
                  style={{borderWidth: 1,borderColor: 'black',padding:9,borderRadius: 5,marginTop:6,marginBottom:20}}
                 >
                  <Text>{moment(deliveryDate).format('DD-MM-YYYY')}</Text>
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
  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <View style={{ width: '49%' }}>
          <Text style={{ fontWeight: '700', fontSize: 16 }}>Origin <Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
            placeholder='Starting Point'
            value={origin}
            onChangeText={setOrigin}
          />
          </View>
<View style={{ width: '49%' }}>
           <Text style={{ fontWeight: '700', fontSize: 16 }}>Destination<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
            placeholder='End Point'
            value={destination}
            onChangeText={setDestination}
          />
     </View>
     
</View>
           <Text style={{ fontWeight: '700', fontSize: 16 }}>Vehicle Type with capacity <Text style={{ color: 'red' }}>*</Text></Text>
           {loading ? (
        <ActivityIndicator size="large" color="navy" />
      ) : (
        <View style={{borderWidth: 1,borderColor: 'black',borderRadius: 8,marginBottom:20,}}>
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

           <Text style={{ fontWeight: '600', fontSize: 16 }}>Freight Type<Text style={{ color: 'red' }}>*</Text></Text>
           <View style={{borderWidth: 1,borderColor: 'black',borderRadius: 8, marginBottom:20}}>
        <Picker
          selectedValue={freightType}
          onValueChange={(itemValue) => setFreightType(itemValue)}
          style={{ height:52,width: '100%',}}
        >
          <Picker.Item label="Select Freight Type" value="" />
          <Picker.Item label="Per Vehicle" value="1" />
          <Picker.Item label="Per Ton" value="2" />
        </Picker>
      </View>
      {freightType ? (
        <Text style={{marginTop:1,fontSize: 15,
color: 'green', marginBottom:20}}>
          Selected: {freightType === '1' ? 'Per Vehicle' : 'Per Ton'}
        </Text>
      ) : null}

          
      {freightType === '1' && (
  <>
    <Text style={{ fontWeight: '700', fontSize: 16 }}>Number of Vehicles<Text style={{ color: 'red' }}>*</Text></Text>
    <TextInput
      style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
      placeholder='Enter number of vehicles'
      value={numVehicles}
      onChangeText={setNumVehicles}
    />

    <Text style={{ fontWeight: '700', fontSize: 16 }}>Per Vehicle Rate (customer)<Text style={{ color: 'red' }}>*</Text></Text>
    <TextInput
      style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
      placeholder='Enter per vehicle rate'
      value={perVehicleRate}
      onChangeText={setPerVehicleRate}
    />
  </>
)}

{freightType === '2' && (
  <>
    <Text style={{ fontWeight: '700', fontSize: 16 }}>Tonnage Count<Text style={{ color: 'red' }}>*</Text></Text>
    <TextInput
      style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
      placeholder='Enter total tonnage'
      value={tonnageCount}
      onChangeText={setTonnageCount}
    />

    <Text style={{ fontWeight: '700', fontSize: 16 }}>Per Ton Rate<Text style={{ color: 'red' }}>*</Text></Text>
    <TextInput
      style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
      placeholder='Enter per ton rate'
      value={perTonRate}
      onChangeText={setPerTonRate}
    />
  </>
)}
   
             <Text style={{ fontWeight: '700', fontSize: 16 }}>Total Indent Amount<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
            placeholder='Total Amount '
            value={totalAmount}
            editable={false}          
          />
          
             <Text style={{ fontWeight: '700', fontSize: 16 }}>Advance %<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
            placeholder="Enter %"
            value={advance}
            onChangeText={setAdvance}
            keyboardType="numeric"
          
          />

           <Text style={{ fontWeight: '700', fontSize: 16 }}>Advance Amount<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, height: 40, marginTop: 6, marginBottom: 20, paddingLeft: 8 }}
            placeholder="Advance Amount"
            value={advanceAmount}
            editable={false}
            onChangeText={setAdvanceAmount}
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
            value={targetRate}
            onChangeText={setTargetRate}
          />
        
          <Pressable  onPress={handleSubmit}>
            <View style={{ backgroundColor: 'navy', height: 40, borderRadius: 6, width: '40%', justifyContent: 'center', alignSelf: 'center' }}>
              <Text style={{ alignSelf: 'center', color: 'white', fontWeight: '600', fontSize: 16 }}>Add Indent</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
    )
}