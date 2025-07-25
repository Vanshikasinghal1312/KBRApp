import React, {useState, useEffect} from "react";
import {View, Text, TextInput, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, Alert} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function KBRIndentScreen(){
  const [selectedIntentNumber, setSelectedIntentNumber] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(''); // Indent Number or Customer Name
const [searchInput, setSearchInput] = useState('');


  const token = '4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8';
  const API_URL = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/getallindents';

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

  // Update filteredData to keep UI consistent
  const updatedFilteredData = filteredData.map((item) =>
    item.indent_number === indentNumber
      ? { ...item, showDetails: !item.showDetails }
      : item
  );

  setFilteredData(updatedFilteredData);
};




   const renderIndentCard = ({ item }) => (
    <View style={{backgroundColor: 'white',borderRadius: 12, padding:20,marginBottom: 16,elevation: 3, marginRight: wp('1%'), marginLeft:hp('0.1%')}}>
      <Text style={{color:'navy',marginBottom: 2, fontWeight:'bold', fontSize:20, textAlign:'center',textDecorationLine: 'underline'
}}><Text style={{fontWeight: '800',fontSize: 20,color: 'navy'}}>{item.indent_number}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: 17,color: 'navy',}}>Customer Name:<Text style={{fontWeight:'500',fontSize: 17,color: 'black',}}> {item.supplier_name}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: 17,color: 'navy',}}>Origin: <Text style={{fontWeight:'500',fontSize: 17,color: 'black',}}>{item.from_location}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: 17,color: 'navy',}}>Destination: <Text style={{fontWeight:'500',fontSize: 17,color: 'black',}}>{item.to_location}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: 17,color: 'navy',}}>Indent Start Date: <Text style={{fontWeight:'500',fontSize: 17,color: 'black',}}>{item.indent_start_date}</Text> </Text>
      
       <TouchableOpacity onPress={() => toggleDetails(item.indent_number)} style={{ backgroundColor: 'navy',borderRadius:8,paddingVertical:8, paddingHorizontal:5, alignItems:'center', alignSelf:'center', marginTop:hp('2%')}}>
          <Text style={{color: 'white',fontWeight: 'bold',}}>{item.showDetails ? 'View less' : 'View more details'}</Text>
        </TouchableOpacity>
    
     {item.showDetails && (
        <View style={{marginTop: 10,}}>
    
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Indent Closing Date: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}> {item.indent_end_date}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Loading Date: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}>{item.loading_date}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Vehicle Type: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}>{item.vehicle_type}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Costing Type: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}>{item.costing_type}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Vehicle/Tonn Count: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}>{item.number_of_vehicles}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Total Indent Amount: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}>{item.indent_amount}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Advance Payment: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}>{item.advance_amount}</Text> </Text>
     </View>
      )}
    </View>
  );  
    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  return (
    <View style={{flex:1, marginTop: hp('2%'),marginLeft:wp('3%'), }}>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
     <TouchableOpacity style={{backgroundColor:'navy', padding:8, borderRadius:8,}}>
        <Text style={{color:'white', alignSelf:'center', textAlign:'center',fontWeight:'500', fontSize:moderateScale(16), alignItems:'center', marginLeft:wp('5%'), marginRight:hp('5%')}}>KBR Indent</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{backgroundColor:'navy', padding:8, borderRadius:8,marginRight:hp('2%')}}>
        <Text  style={{color:'white', alignSelf:'center', textAlign:'center', fontWeight:'500', fontSize:moderateScale(16), alignItems:'center', marginLeft:wp('2%'), marginRight:hp('2%')}}>Create New </Text>
      </TouchableOpacity>
      </View>
  <View style={{marginHorizontal:8}}>
    <View style={{flexDirection:'row',marginTop: hp('0.8%')}}>
      
       <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginRight: wp('2%'), marginVertical: 14, width: 150, backgroundColor: '#fff' }}>
  <Picker
    dropdownIconColor="navy"
    selectedValue={filterType}
    onValueChange={(itemValue) => {
      setFilterType(itemValue);
      setSelectedIntentNumber(null);
      setSelectedCustomerName(null);
      setSearchInput('');
      setFilteredData(data); // Reset to full data on filter change
    }}
  >
    <Picker.Item label="Select" value="" />
    <Picker.Item label="Indent Number" value="Indent Number" />
    <Picker.Item label="Customer Name" value="Customer Name" />
  </Picker>
</View>

        
      {/* <Picker
        selectedValue={selectedIntentNumber}
        onValueChange={(itemValue) => setSelectedIntentNumber(itemValue)}
        style={{backgroundColor: '#fff',borderRadius: 8,marginBottom: 10,}}
      >
        <Picker.Item label=" Intent Number" value="" />
        {[...new Set(filteredData.map(item => item.indent_number))].map(indent => (
          <Picker.Item label={indent} value={indent} key={indent} />
        ))}
      </Picker>

      <Picker
        selectedValue={selectedCustomerName}
        onValueChange={(itemValue) => setSelectedCustomerName(itemValue)}
        style={{backgroundColor: '#fff',borderRadius: 8,marginBottom: 10,}}
      >
        <Picker.Item label="Select Customer Name" value="" />
         {[...new Set(filteredData.map(item => item.user_id))].map(customer => (
          <Picker.Item label={`Customer ${customer}`} value={customer} key={customer} />
        ))}
      </Picker> */}
       {/* {filterType === 'Indent Number' && (
  <Picker
    selectedValue={selectedIntentNumber}
    onValueChange={(itemValue) => setSelectedIntentNumber(itemValue)}
    style={{ backgroundColor: '#fff', borderRadius: 8, marginBottom: 10 }}
  >
    <Picker.Item label="Select Indent Number" value="" />
    {[...new Set(data.map(item => item.indent_number))].map(indent => (
      <Picker.Item label={indent} value={indent} key={indent} />
    ))}
  </Picker>
)} */}

{/* {filterType === 'Customer Name' && (
  <Picker
    selectedValue={selectedCustomerName}
    onValueChange={(itemValue) => setSelectedCustomerName(itemValue)}
    style={{ backgroundColor: '#fff', borderRadius: 8, marginBottom: 10 }}
  >
    <Picker.Item label="Select Customer Name" value="" />
    {[...new Set(data.map(item => item.supplier_name))].map(customer => (
      <Picker.Item label={customer} value={customer} key={customer} />
    ))}
  </Picker>
)} */}

        <TextInput
          style={{ borderWidth: 1, marginRight: wp('2%'), borderColor: '#ccc', width: 150,backgroundColor: '#fff',borderRadius: 6, marginVertical: 14, height: 53, paddingLeft: 10,fontSize:12 }}
          // placeholder='Please Enter'
          placeholder={`Enter ${filterType}`}
          placeholderTextColor={'grey'}
           value={searchInput}
  onChangeText={setSearchInput}
        />
      <View style={{flex:0.1}}> 
        {/* KBR-IND-00001 */}
            <TouchableOpacity 
              onPress={() => {
    if (!filterType) {
     Alert.alert('Please select a filter type');
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
            style={{ marginTop: hp('2%'),height: 42, width: 42, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: 'navy'}}>
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
            contentContainerStyle={{ paddingBottom: 100 }}
        />
        </View>
      )}      
  </View>

 
</View>
  )
}