import React,{useState} from "react";
import {View, Text, TouchableOpacity} from 'react-native'
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

export default function IndentDatePicker() {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <View style={{ padding: 20 }}>
      {/* Open Calendar Button */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          borderWidth: 1,
          borderColor: '#999',
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text>{moment(date).format('DD-MM-YYYY')}</Text>
      </TouchableOpacity>

      {/* Calendar Picker */}
      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        onConfirm={(selectedDate) => {
          setOpen(false);
          setDate(selectedDate);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
}
