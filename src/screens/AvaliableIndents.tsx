import React, {useState, useEffect} from "react";
import {View, Text, TextInput, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, Alert, Modal} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function AvailiableIndents(){
  const [selectedIntentNumber, setSelectedIntentNumber] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(''); 
  const [searchInput, setSearchInput] = useState('');
  const [showForm, setShowForm] = useState(false);
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
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Loading Date: <Text style={{fontWeight:'500',fontSize: 17,color: 'black',}}>{item.loading_date}</Text> </Text>
   
   <View style={{flexDirection:'row', justifyContent:'space-evenly',marginTop: hp('2%') }}>
   
       <TouchableOpacity onPress={() => toggleDetails(item.indent_number)} style={{ backgroundColor: 'navy',borderRadius:8,paddingVertical:8, paddingHorizontal:15, alignItems:'center', alignSelf:'center', marginTop:hp('2%')}}>
          <Text style={{color: 'white',fontWeight: 'bold',}}>{item.showDetails ? 'View less' : 'View more details'}</Text>
        </TouchableOpacity>
     <TouchableOpacity  onPress={() => {
    setSelectedIndent(item);
    setModalVisible(true);
  }}
   style={{ backgroundColor: 'navy',borderRadius:8,paddingVertical:8, paddingHorizontal:15, alignItems:'center', alignSelf:'center', marginTop:hp('2%')}}
  >
  <Text style={{color: 'white',fontWeight: 'bold' }}>Place Vehicle +</Text>
  </TouchableOpacity>
    </View>
     {item.showDetails && (
        <View style={{marginTop: 10,}}>
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Indent Start Date: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}>{item.indent_start_date}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Indent Closing Date: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}> {item.indent_end_date}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Vehicle Type: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}>{item.vehicle_type}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Costing Type: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}>{item.costing_type === '1' ? 'Per Vehicle' : item.costing_type === '2' ? 'Per Tonn' : 'N/A'}</Text></Text>
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Vehicle/Tonn Count: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}>{item.number_of_vehicles}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Remaining Vehicle/Tonn to Place: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}>{item.remaining_vehicle_count}</Text> </Text>
      <Text style={{fontWeight: 'bold',fontSize: 15,color: 'navy',}}>Target Rate: <Text style={{fontWeight:'500',fontSize: 15,color: 'black',}}>{item.market_rate}</Text> </Text>   
     </View>
      )}
     
    </View>
  );  
  
    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;


   const handleSubmit = (item) => {
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

  // All validations passed ✅
  setShowError(false);

  Alert.alert('Vehicle Placed!');

  // Reset form
  setBrokerName('');
  setCount('');
  setRate('');
  setModalVisible(false);
};


  return (

    <View style={{flex:1, marginTop: hp('0.5%'),marginLeft:wp('3%'), }}>
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
      setFilteredData(data); 
    }}
    >
    <Picker.Item label="Select" value="" />
    <Picker.Item label="Indent Number" value="Indent Number" />
    <Picker.Item label="Customer Name" value="Customer Name" />
  </Picker>
</View>
        <TextInput
          style={{ borderWidth: 1, marginRight: wp('2%'), borderColor: '#ccc', width: 150,backgroundColor: '#fff',borderRadius: 6, marginVertical: 14, height: 53, paddingLeft: 10,fontSize:12 }}
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
            style={{ marginTop: hp('2%'),height: 45, width: 45, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: 'navy'}}>
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
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
        Add Broker Pricing {selectedIndent?.indent_number}
      </Text>

<View style={{borderWidth:1, borderColor:'darkgray', borderRadius:8, marginBottom:12, padding:0.1}}>
  <Picker
  selectedValue={brokerName}
  onValueChange={(item)=>setBrokerName(item)}
  dropdownIconColor='navy'
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
        onChangeText={setCount}
        keyboardType="numeric"
        style={{borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginBottom: 12}}
      />
      <TextInput
        placeholder="Total Rate"
        value={rate}
        onChangeText={setRate}
        keyboardType="numeric"
        style={{borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginBottom: 12}}
      />

      {showError && (
        <Text style={{ color: 'red', marginBottom: 10 }}>
          ⚠️ Tonnage count cannot be less than required
        </Text>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleSubmit(selectedIndent)}>
          <Text style={{ color: 'navy', fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
  
  </View>

 

</View>

  )
}