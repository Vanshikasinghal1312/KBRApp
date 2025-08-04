import moment from 'moment';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Keyboard, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View , Dimensions, Modal, FlatList} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');
import AsyncStorage from "@react-native-async-storage/async-storage";




export default function HomeScreen() {
    const route = useRoute();
const { indent_number, dummy_supplier_code } = route.params;
const { rate, vehicle_count } = route.params || {};
const [perVehicleRate, setPerVehicleRate] = useState('');
const [indentNumber, setIndentNumber] = useState(indent_number || '');
const [supplierCode, setSupplierCode] = useState(dummy_supplier_code || '');
const [advancePercentage, setAdvancePercentage] = useState('0');
const [advanceAmount, setAdvanceAmount] = useState('');
const [balanceAmount, setBalanceAmount] = useState('');
const [userId, setUserId] = useState('');

const [Vendor, setVendor] = useState([]);
const [selectedVendor, setselectedVendor] = useState('');
const [vendorModalVisible, setVendorModalVisible] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [filteredVendors, setFilteredVendors] = useState([]);

const [Vehiclenumber, setVehiclenumber] = useState([]);
const [selectedVehicle, setselectVehicle] = useState('');
const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
const [searchQuery1, setSearchQuery1] = useState('');
const [filteredVehicleNumbers, setfilteredVehicleNumbers] = useState([]);

const [driverName, setDriverName] = useState([]);
const [selectedDriver, setselectDriver] = useState('');
const [driverModalVisible, setDriverModalVisible] = useState(false);
const [searchQuery2, setSearchQuery2] = useState('');
const [filteredDrivers, setfilteredDrivers] = useState([]);
const [loading, setLoading] = useState(true)
const [accountNumber, setAccountNumber] = useState('');
const [tdsPercentage, setTdsPercentage] = useState('');
const [selectedVendorId, setSelectedVendorId] = useState('');
const [selectedVendorDisplay, setSelectedVendorDisplay] = useState('');
const [onlyVendorName, setOnlyVendorName] = useState('');

const [placedVehicles, setPlacedVehicles] = useState([]);
 
const VendorsName_API_URL = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/getallvendors'
const VehicleNumber_API_URL ='https://kbrtransways.com/testing/tms/tms_api2/index.php/getallvehicles'
const DriverName_API_URL='https://kbrtransways.com/testing/tms/tms_api2/index.php/getalldrivers'
const PlaceVehicle_API_URL ='https://kbrtransways.com/testing/tms/tms_api2/index.php/newvehicleplacement'

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
    axios.get(VendorsName_API_URL, {
  headers: {
    Authorization: `Bearer 4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8`,
  }})
      .then(response => {
              console.log('API response1:', response.data);
        setVendor(response.data.data); 
        setFilteredVendors(response.data.data);
        setLoading(false);
    })
      .catch(error => {
        console.error('Failed to fetch Vendors:', error.response?.data || error.message);
        setLoading(false);
      });   
  }, []);

useEffect(() => {
    axios.get(VehicleNumber_API_URL, {
  headers: {
    Authorization: `Bearer 4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8`,
  }})
      .then(response => {
              console.log('API response2:', response.data);
        setVehiclenumber(response.data.data); 
        setfilteredVehicleNumbers(response.data.data);
        setLoading(false);
    })
      .catch(error => {
        console.error('Failed to fetch Vehicles:', error.response?.data || error.message);
        setLoading(false);
      });   
  }, []);

  useEffect(()=>{
    axios.get(DriverName_API_URL, {
        headers:{
            Authorization: `Bearer 4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8`
        }
    })
    .then (response =>{
        setDriverName(response.data.data)
        setfilteredDrivers(response.data.data)
        setLoading(false)
    })
    .catch(error =>{
        console.error('Failed to fetch Drivers', error.response?.data || error.message)
        setLoading(false)
    })
  },[])

  useEffect(()=>{
    if (rate && vehicle_count){
        const pervehiclerate= (parseFloat(rate)/parseFloat(vehicle_count)).toFixed(2)
        setPerVehicleRate(pervehiclerate.toString())
    }
  },[rate,vehicle_count])

  const handleSubmit = async ()=>{
if (!selectedVendorId || !selectedVehicle?.id || !selectedDriver?.id || !advancePercentage.trim()) {
  Alert.alert('Please Enter all required fields');
  return;
}
  const percentage = Number(advancePercentage);
  if (isNaN(percentage) || percentage < 0) {
    Alert.alert("Validation Error", "Advance Percentage must be 0 or greater");
    return;
  }
    const payload =  {
    user_id: userId,
    indent_number: indentNumber,
    dummy_supplier_code: supplierCode,
    supplier_id: selectedVendorId,
    vehicle_id: selectedVehicle.id, 
    driver_id: selectedDriver.id,
    per_vehicle_rate: perVehicleRate,
   supplier_advance_percentage: advancePercentage.toString(), 
    advance_amount: advanceAmount,
    balance_amount: balanceAmount,
    }
    try {
        const response= await axios.post(PlaceVehicle_API_URL,payload,{
            headers:{
                'Authorization': `Bearer 4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8`,
                'Content-Type' : 'application/json',           
            }
        })
        if (response.data.status == "1" || response.data.status == 1){
            Alert.alert('Vehicle Placed Successfully!')
            setPlacedVehicles(prev => [
  ...prev,
  {
    indent_number: indentNumber,
    // vendor_name: selectedVendorDisplay,
    vendor_name: onlyVendorName, // ✅ Show only vendor name here
    vehicle_number: selectedVehicle.vehicle_number,
    driver_name: selectedDriver.driver_name,
    driver_mobile: selectedDriver.driver_mobile,
        tripStarted: false, // 👈 Add this field

  }
]);
            
        } 
        
else {
            Alert.alert('Failed to Place Vehicle', response.data?.message || 'Something wrong')
            console.log('Failed Payload:', payload);  
  console.log('API Response:', response.data); 
        }

    } catch(error){
    console.error('API error:', error);
    Alert.alert('Error', error?.response?.data?.message || 'Something went wrong');    }
  }

const handleVendorsSearch = text => {
  setSearchQuery(text);
  const filtered = Vendor.filter(item =>
    item?.toLowerCase().startsWith(text.toLowerCase())
  );
  setFilteredVendors(filtered);
};

const handlevehiclenumberSearch = text => {
  setSearchQuery1(text);
  const filtered = Vehiclenumber.filter(item =>
    item.vehicle_number?.toLowerCase().startsWith(text.toLowerCase())
  );
  setfilteredVehicleNumbers(filtered);
};

const handleDriversrSearch = text => {
  setSearchQuery1(text);
  const filtered = driverName.filter(item =>
    item?.driver_name?.toLowerCase().startsWith(text.toLowerCase())
  );
  setfilteredDrivers(filtered);
};

useEffect(() => {
  if (perVehicleRate && advancePercentage !== '') {
    const perRate = parseFloat(perVehicleRate);
    const percent = parseFloat(advancePercentage);
    const advAmt = ((perRate * percent) / 100).toFixed(2);
    const balAmt = (perRate - advAmt).toFixed(2);
    setAdvanceAmount(advAmt.toString());
    setBalanceAmount(balAmt.toString());
  } else {
    setAdvanceAmount('');
    setBalanceAmount('');
  }
}, [advancePercentage, perVehicleRate]);


const handleStartTrip = (index) => {
  setPlacedVehicles(prev => {
    const updated = [...prev];
    updated[index].tripStarted = true;
    return updated;
  });
};


  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 20, marginTop:40 }}>
        {placedVehicles.length > 0 && (
  <View style={{ marginBottom: 20 }}>
    <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
      {placedVehicles.map((item, index) => (
        <View key={index} style={{ flexDirection: 'column', padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
        
          <Text style={{color:'navy',marginBottom: verticalScale(2),fontWeight: 'bold',fontSize: scale(13), textAlign:'center',textDecorationLine: 'underline'
            }}><Text style={{fontWeight: '800',fontSize:scale(15),color: '#00457c'}}>{item.indent_number}</Text></Text>
                    <Text style={{fontWeight: '500',fontSize: scale(13),color: '#00457c',}}>Vendor Name: <Text style={{fontWeight:'400',fontSize: scale(13),color: 'black',}}>{item.vendor_name}</Text> </Text>
          
                  <Text style={{fontWeight: '500',fontSize: scale(14),color: '#00457c',}}>Vehicle Number: <Text style={{fontWeight:'400',fontSize: scale(13),color: 'black',}}>{item.vehicle_number}</Text></Text>
                  <Text style={{fontWeight: '500',fontSize: scale(14),color: '#00457c',}}>Driver Name: <Text style={{fontWeight:'400',fontSize: scale(13),color: 'black',}}>{item.driver_name}</Text> </Text>
                       <Text style={{fontWeight: '500',fontSize: scale(14),color: '#00457c',}}>Driver Phone: <Text style={{fontWeight:'400',fontSize: scale(13),color: 'black',}}>{item.driver_mobile}</Text> </Text>
          <TouchableOpacity
      onPress={() => handleStartTrip(index)}
      disabled={item.tripStarted}
      style={{
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: item.tripStarted ? '#f8d7da' : '#28a745',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
        {item.tripStarted ? 'Trip Started' : 'Start Trip'}
      </Text>
    </TouchableOpacity>
        </View>
      ))}
    </View>
  </View>
)}

        <View style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5, padding: 10 }}>
        <Text style={{ fontWeight: '600', fontSize: moderateScale(14) }}>Indent Number <Text style={{ color: 'red' }}>*</Text></Text>
   
         <TextInput
          placeholder="Indent Number"
          value={indentNumber}
          onChangeText={setIndentNumber}
          editable={false} 
          style={{ borderWidth: 1, marginBottom: 8, padding: 6, borderRadius: 6 , backgroundColor:'lightgray',fontSize: moderateScale(12), color:'black'}}
          />
          <TextInput
            placeholder="Dummy Supplier Code"
            value={supplierCode}
            onChangeText={setSupplierCode}
            editable={false} 
            style={{ borderWidth: 1, marginBottom: 12, padding:6, borderRadius: 6,backgroundColor:'lightgray',fontSize: moderateScale(12), color:'black' }}
           />
          
          <Text style={{ fontWeight: '600', fontSize: moderateScale(14),marginTop: hp('0.5%'), marginBottom:hp('0.8%')}}>Vendor Name <Text style={{ color: 'red' }}>*</Text></Text>
            <TouchableOpacity onPress={() => setVendorModalVisible(true)}
             style={{ borderWidth: 1, padding:8, marginBottom: hp('0.5%'), borderRadius: moderateScale(5) }}>
            <Text style={{fontSize:moderateScale(12)}}> {selectedVendorDisplay || 'Select Vendor'}</Text> 
         </TouchableOpacity>
         <Modal visible={vendorModalVisible} animationType="slide">
           <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
             <TextInput
               placeholder="Search Vendors"
               value={searchQuery}
               onChangeText={handleVendorsSearch}
               style={{
                 borderWidth: scale(1),
                 borderColor: '#ccc',
                 margin: moderateScale(10),
                 padding: moderateScale(10),
                 borderRadius: moderateScale(10),
               }}
             />
         
             {filteredVendors.length === 0 ? (
               <Text style={{ textAlign: 'center', marginTop: 10 }}>No data found</Text>
             ) : (
               <FlatList
                 data={filteredVendors}
                 keyExtractor={(item) => item.id.toString()}
                 renderItem={({ item }) => (
                   <TouchableOpacity
                     onPress={() => {
                     setSelectedVendorId(item.id); 
                     setSelectedVendorDisplay(`${item.supplier_name} - ${item.account_number} - ${item.tds_deduction_percentage}%`);
                     setOnlyVendorName(item.supplier_name); // 👈 Add this extra state to store only name
                     setVendorModalVisible(false);
                    }}
                     style={{padding: 15,borderBottomWidth: 1,borderBottomColor: '#eee'}}
                   >
                     <Text>  {item.supplier_name}   -  {item.account_number}  || {item.tds_deduction_percentage}%</Text>
                   </TouchableOpacity>
                 )}
               />
             )}
         
             <TouchableOpacity
               onPress={() => setVendorModalVisible(false)}
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

          <Text style={{ fontWeight: '600', fontSize: moderateScale(14),marginTop: hp('0.8%'), marginBottom:hp('0.8%')}}>Vehicle Number<Text style={{ color: 'red' }}>*</Text></Text>
                   <TouchableOpacity
           onPress={() => setVehicleModalVisible(true)}
           style={{ borderWidth: 1, padding: 8, marginBottom: hp('0.5%'), borderRadius: moderateScale(5) }}
         >
            <Text style={{fontSize:moderateScale(12)}}>{selectedVehicle?.vehicle_number || 'Select Vehicle Number'}</Text> 
         </TouchableOpacity>
         <Modal visible={vehicleModalVisible} animationType="slide">
           <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
             <TextInput
               placeholder="Search Vehicle Numbers"
               value={searchQuery1}
               onChangeText={handlevehiclenumberSearch}
               style={{
                 borderWidth: scale(1),
                 borderColor: '#ccc',
                 margin: moderateScale(10),
                 padding: moderateScale(10),
                 borderRadius: moderateScale(10),
               }}
             />
         
             {filteredVehicleNumbers.length === 0 ? (
               <Text style={{ textAlign: 'center', marginTop: 10 }}>No data found</Text>
             ) : (
               <FlatList
                 data={filteredVehicleNumbers}
                 keyExtractor={(item, index) => index.toString()}
                 renderItem={({ item }) => (
                   <TouchableOpacity
                     onPress={() => {
                       setselectVehicle(item);
                       setVehicleModalVisible(false);
                     }}
                     style={{
                       padding: 15,
                       borderBottomWidth: 1,
                       borderBottomColor: '#eee',
                     }}
                   >
                     <Text>{item.vehicle_number}</Text>
                   </TouchableOpacity>
                 )}
               />
             )}
         
             <TouchableOpacity
               onPress={() => setVehicleModalVisible(false)}
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



          <Text style={{ fontWeight: '600', fontSize: moderateScale(14),marginTop: hp('0.8%'), marginBottom:hp('0.8%')}}>Driver Name <Text style={{ color: 'red' }}>*</Text></Text>
                   <TouchableOpacity
           onPress={() => setDriverModalVisible(true)}
           style={{ borderWidth: 1, padding: 8, marginBottom: hp('0.5%'), borderRadius: moderateScale(5) }}
         >
            <Text style={{fontSize:moderateScale(12)}}>{selectedDriver?.driver_name || 'Select Driver'}</Text> 
         </TouchableOpacity>
         <Modal visible={driverModalVisible} animationType="slide">
           <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
             <TextInput
               placeholder="Search Drivers"
               value={searchQuery2}
               onChangeText={handleDriversrSearch}
               style={{
                 borderWidth: scale(1),
                 borderColor: '#ccc',
                 margin: moderateScale(10),
                 padding: moderateScale(10),
                 borderRadius: moderateScale(10),
               }}
             />
         
             {filteredDrivers.length === 0 ? (
               <Text style={{ textAlign: 'center', marginTop: 10 }}>No data found</Text>
             ) : (
               <FlatList
                 data={filteredDrivers}
                 keyExtractor={(item, index) => index.toString()}
                 renderItem={({ item }) => (
                   <TouchableOpacity
                     onPress={() => {
                       setselectDriver(item);
                       setDriverModalVisible(false);
                     }}
                     style={{
                       padding: 15,
                       borderBottomWidth: 1,
                       borderBottomColor: '#eee',
                     }}
                   >
                   <Text>{item.driver_name} - {item.driver_mobile}</Text>
                   </TouchableOpacity>
                 )}
               />
             )}
         
             <TouchableOpacity
               onPress={() => setDriverModalVisible(false)}
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
 <View style={{flexDirection:'row', justifyContent:'space-between'}}>
    <View style={{ width: '49%' }}>
             <Text style={{ fontWeight: '700', fontSize:  moderateScale(14) ,marginTop: hp('0.8%'), marginBottom:hp('0.5%') }}>Per Vehicle Rate <Text style={{ color: 'red' }}>*</Text></Text>
         
         <TextInput
               style={{ borderWidth: 1, borderRadius: 5, height: hp('4.5%'), marginTop: 6, marginBottom: 12, paddingLeft: 8,fontSize:moderateScale(12),backgroundColor:'lightgray',color:'black' }}
               placeholder='Enter vehicle rate'
               keyboardType="numeric"
               editable={false}
               value={perVehicleRate}
             />
         </View>
         <View style={{ width: '49%' }}>
             <Text style={{ fontWeight: '700', fontSize:  moderateScale(14),marginTop: hp('0.7%'), marginBottom:hp('0.5%')  }}>Avg. Percentages <Text style={{ color: 'red' }}>*</Text></Text>
         
         <TextInput
               style={{ borderWidth: 1, borderRadius: 5, height:hp('4.5%'), marginTop: 6, marginBottom:15, paddingLeft: 8,fontSize:moderateScale(12) }}
               placeholder='Enter Percentages'
               keyboardType="numeric"
               value={advancePercentage}
               onChangeText={(text) => setAdvancePercentage(text)}             
             />
</View> 
</View>

<View style={{flexDirection:'row', justifyContent:'space-between'}}> 
  <View style={{width:'49%'}}>
          <Text style={{ fontWeight: '700', fontSize:  moderateScale(14) ,marginTop: hp('0.3%'), marginBottom:hp('0.5%') }}>Adavance Amount<Text style={{ color: 'red' }}>*</Text></Text>
         
         <TextInput
               style={{ borderWidth: 1, borderRadius: 5, height:hp('4.5%'), marginTop: 6, marginBottom: 12, paddingLeft: 8, fontSize:moderateScale(12),backgroundColor:'lightgray',color:'black' }}
               placeholder='Enter per vehicle rate'
               keyboardType="numeric"
               value={advanceAmount}
               editable={false}
               
             />

</View>
<View style={{width:'49%'}}>
            <Text style={{ fontWeight: '700', fontSize:  moderateScale(14),marginTop: hp('0.2%'), marginBottom:hp('0.5%')  }}>Balance Amount <Text style={{ color: 'red' }}>*</Text></Text>
         
         <TextInput
               style={{ borderWidth: 1, borderRadius: 5, height:hp('4.5%'), marginTop: 6, marginBottom: 20, paddingLeft: 8,fontSize:moderateScale(12),backgroundColor:'lightgray',color:'black'}}
               placeholder='Enter per vehicle rate'
               keyboardType="numeric"
               value={balanceAmount}
               editable={false}
               
             />
          
     
      </View>
     </View>    
         
          <Pressable onPress={handleSubmit}>
            <View style={{ backgroundColor: '#0b4b85', height: 40, borderRadius: 6, width: '40%', justifyContent: 'center', alignSelf: 'center' }}>
              <Text style={{ alignSelf: 'center', color: 'white', fontWeight: '600', fontSize: 16 }}>Place Vehicle</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}