import React, {useState, useEffect} from "react";
import {View, Text, TextInput, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, Alert, AppState} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width, height } = Dimensions.get('window');
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useFocusEffect } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function VehiclePlacementScreen({navigation}){
  const [selectedIntentNumber, setSelectedIntentNumber] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(''); 
  const [searchInput, setSearchInput] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const token = '4f9e8d81c7b4a9fdf6b3e1c8930e2a171eb3f2e6bd8d59ef821a77c3a0f4d6e8';
  const VehiclePlacement_URL = 'https://kbrtransways.com/testing/tms/tms_api2/index.php/vehicleplacement';
  
    useEffect(() => {
    VehiclePlacementFecth();
  }, []);

  useEffect(() => {
  const interval = setInterval(() => {
    VehiclePlacementFecth();
  }, 30000); 

  return () => clearInterval(interval); 
}, []);

  useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      VehiclePlacementFecth();
    }
  });

  return () => subscription.remove();
}, []);

useFocusEffect(
  React.useCallback(() => {
    VehiclePlacementFecth();
  }, [])
);

  const VehiclePlacementFecth = async ()=>{
    try {
    const res = await axios.get (VehiclePlacement_URL,{
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
        {/* <Text style={{color:'navy',marginBottom: verticalScale(2),fontWeight: 'bold',fontSize: scale(20), textAlign:'center',textDecorationLine: 'underline'
  }}><Text style={{fontWeight: '800',fontSize:scale(20),color: 'navy'}}>{item.indent_number}</Text></Text> */}
          <Text style={{color: '#fff',fontWeight: '600',fontSize: wp('3.8%'),marginTop:hp('2%')}}>Customer Name: <Text style={{color: '#ccc',fontSize: wp('3.8%'),marginBottom: hp('0.8%')}}>{item.customer_name}</Text> </Text>
        <Text style={{color: '#fff',fontWeight: '600',fontSize: wp('3.8%'),marginTop:hp('1%')}}>Vehicle Type: <Text style={{color: '#ccc',fontSize: wp('3.8%'),marginBottom: hp('0.8%')}}>{item.Vehicle_type}</Text> </Text>
             <Text style={{color: '#fff',fontWeight: '600',fontSize: wp('3.8%'),marginTop:hp('1%')}}>Supplier Rate: <Text style={{color: '#ccc',fontSize: wp('3.8%'),marginBottom: hp('0.8%')}}>{item.rate}</Text> </Text>

        {/* <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Origin: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}>{item.origin}</Text></Text>
        <Text style={{fontWeight: 'bold',fontSize: scale(14),color: 'navy',}}>Destination: <Text style={{fontWeight:'500',fontSize: scale(13),color: 'black',}}>{item.destination}</Text> </Text> */}

<View style={{
        flexDirection: 'row',
        marginTop: 10,
        alignItems:'center'
      }}>
      
        {/* ORIGIN */}
        <View style={{ flex:2, alignItems: 'flex-start' }}>
          {(() => {
            const fromParts = item.origin?.split(',') || [];
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
            const toParts = item.destination?.split(',') || [];
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



     <View style={{flexDirection:'row', justifyContent:'space-between',marginTop: hp('1%') }}>
     
         <TouchableOpacity onPress={() => toggleDetails(item.indent_number)} style={{backgroundColor: '#eec340',borderRadius: wp('6%'),paddingVertical:hp('0.5%'),paddingHorizontal: wp('4.5%'),marginTop:hp('2%'), }}>
            <Text style={{color: 'black',fontWeight: 'bold', fontSize: wp('3.2%')}}>{item.showDetails ? 'View less' : 'View more'}</Text>
          </TouchableOpacity>
     {
  parseInt(item.placed_vehicles) < parseInt(item.vehicle_count) ? (
    <TouchableOpacity  
    style={{backgroundColor: '#df4444',borderRadius: wp('6%'),paddingVertical:hp('0.5%'),paddingHorizontal:wp('4%'), marginTop:hp('2%'), marginRight:wp('4%')}}
      onPress={() => { navigation.navigate('Place VehicleForm', {
  indent_number: item.indent_number,
  dummy_supplier_code: item.dummy_supplier_code,
  rate: item.rate,
  vehicle_count: item.vehicle_count
})
       console.log('Placing vehicle for:', item.indent_number);
      }}
    >
      <Text style={{color: 'white',fontWeight: 'bold', fontSize: wp('3.2%')}}>Place Vehicle +</Text>
    </TouchableOpacity>
  ) : (
    <Text style={{ marginTop: hp('2%'), fontWeight: 'bold', color: 'lightgreen',  marginLeft:wp('1%'), marginRight:wp('4%'), fontSize:moderateScale(14) }}>All Vehicle Placed</Text>
  )
}

      </View>
       {item.showDetails && (
          <View style={{marginTop: hp('1%'),}}>
        <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Supplier Name: <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),}}> {item.supplier_name}</Text></Text>
        <Text style={{color: '#fff',fontWeight: '500',fontSize: wp('3.6%')}}>Vehicle/Tonn Count: <Text style={{color: '#ccc',fontSize: wp('3.6%'),marginBottom: hp('0.8%'),}}>{item.vehicle_count}</Text> </Text>
       </View>
        )}
       
      </View>
    );  
    
      if (loading) return <ActivityIndicator size="large" style={{ marginTop: hp('5%') }} />;
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
    await VehiclePlacementFecth();
    setRefreshing(false);
  }}
         />
        </View>
      )}      
  </View> 
</View>
  )
}