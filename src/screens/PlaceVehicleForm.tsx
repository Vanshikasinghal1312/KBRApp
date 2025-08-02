import moment from 'moment';
import { useState } from 'react';
import { Alert, Keyboard, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View , Dimensions, Modal, FlatList} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');


export default function HomeScreen() {
    const route = useRoute();
const { indent_number, dummy_supplier_code } = route.params;
  const [indentNumber, setIndentNumber] = useState(indent_number || '');
const [supplierCode, setSupplierCode] = useState(dummy_supplier_code || '');

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

 



  

  const handleSubmit = () => {
    // if (!license) {
    //   alert("Please provide License Number")
    // } else if (!dob ) {
    //   alert("Please provide DOB")
    // } else if (!driverName) {
    //   alert("Please provide Driver Name")
    // } else if (!licenseExpiryDate) {
    //   alert("Please provide License Expiry Date")
    // } else if (!mobile || mobile.length < 10) {
    //   alert("Please provide Valid Mobile No.")
    // } else {
    //   const birthDate = moment(dob, "DD-MM-YYYY");
    //   const isAbove18 = birthDate.isSameOrBefore(moment().subtract(18, 'years'));
    //   if(!isAbove18) {
    //     alert("Your age must be above 18")
    //   } else {
    //     Alert.alert("Form Submit Successfully.")
    //     setLicense('')
    //     setDOB('')
    //     setDriverName('')
    //     setLicenseExpiryDate('')
    //     setMobile('')
    //     setLicenseFile('No File Chosen')
    //     setAadharFile('No File Chosen')
    //   }
    // }
  }


const handleVendorsSearch = text => {
  setSearchQuery(text);
  const filtered = Vendor.filter(item =>
    item.vendor_name?.toLowerCase().startsWith(text.toLowerCase())
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
    item.drivers?.toLowerCase().startsWith(text.toLowerCase())
  );
  setfilteredDrivers(filtered);
};

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 20, marginTop:40 }}>
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
            <Text style={{fontSize:moderateScale(12)}}>{selectedVendor?.vendor_name || 'Select Vendor'}</Text> 
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
                 keyExtractor={(item, index) => index.toString()}
                 renderItem={({ item }) => (
                   <TouchableOpacity
                     onPress={() => {
                       setselectedVendor(item);
                       setVendorModalVisible(false);
                     }}
                     style={{
                       padding: 15,
                       borderBottomWidth: 1,
                       borderBottomColor: '#eee',
                     }}
                   >
                     <Text>{item.vendor_name}</Text>
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
            <Text style={{fontSize:moderateScale(12)}}>{selectedVehicle?.vehicle_numbers || 'Select Vehicle Number'}</Text> 
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
                     <Text>{item.driver_name}</Text>
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
               style={{ borderWidth: 1, borderRadius: 5, height: hp('4.5%'), marginTop: 6, marginBottom: 12, paddingLeft: 8,fontSize:moderateScale(12) }}
               placeholder='Enter vehicle rate'
               keyboardType="numeric"
               
             />
         </View>
         <View style={{ width: '49%' }}>
             <Text style={{ fontWeight: '700', fontSize:  moderateScale(14),marginTop: hp('0.7%'), marginBottom:hp('0.5%')  }}>Avg. Percentages <Text style={{ color: 'red' }}>*</Text></Text>
         
         <TextInput
               style={{ borderWidth: 1, borderRadius: 5, height:hp('4.5%'), marginTop: 6, marginBottom:15, paddingLeft: 8,fontSize:moderateScale(12) }}
               placeholder='Enter Percentages'
               keyboardType="numeric"
               
             />
</View> 
</View>

<View style={{flexDirection:'row', justifyContent:'space-between'}}> 
  <View style={{width:'49%'}}>
          <Text style={{ fontWeight: '700', fontSize:  moderateScale(14) ,marginTop: hp('0.3%'), marginBottom:hp('0.5%') }}>Adavance Amount<Text style={{ color: 'red' }}>*</Text></Text>
         
         <TextInput
               style={{ borderWidth: 1, borderRadius: 5, height:hp('4.5%'), marginTop: 6, marginBottom: 12, paddingLeft: 8, fontSize:moderateScale(12) }}
               placeholder='Enter per vehicle rate'
               keyboardType="numeric"
               
             />

</View>
<View style={{width:'49%'}}>
            <Text style={{ fontWeight: '700', fontSize:  moderateScale(14),marginTop: hp('0.2%'), marginBottom:hp('0.5%')  }}>Balance Amount <Text style={{ color: 'red' }}>*</Text></Text>
         
         <TextInput
               style={{ borderWidth: 1, borderRadius: 5, height:hp('4.5%'), marginTop: 6, marginBottom: 20, paddingLeft: 8,fontSize:moderateScale(12)}}
               placeholder='Enter per vehicle rate'
               keyboardType="numeric"
               
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