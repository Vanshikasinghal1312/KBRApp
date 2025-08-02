import React,{useState} from "react";
import {View, Text, TouchableOpacity} from 'react-native'
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

export default function IndentDatePicker() {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    //         <View>
    //             <TextInput
    //   placeholder="Indent Number"
    //   value={indentNumber}
    //   onChangeText={setIndentNumber}
    //   editable={false} // or true if you want user to edit
    //   style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 6 }}
    // />
    
    // <TextInput
    //   placeholder="Dummy Supplier Code"
    //   value={supplierCode}
    //   onChangeText={setSupplierCode}
    //   editable={false} // or true if you want user to edit
    //   style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 6 }}
    // />
    //         </View>
  );
}
