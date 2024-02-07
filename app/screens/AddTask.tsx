// AddTaskScreen.tsx

import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { db } from "../../firebaseConfig";

const AddTaskScreen = ({navigation}:any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
 
  const [priority, setPriority] = useState("");
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [formattedSelectedStartTime, setFormattedSelectedStartTime] = useState("");
  const [formattedSelectedEndTime, setFormattedSelectedEndTime] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string | undefined>();

const priorityOptions = ['High', 'Medium', 'Low'];

  const onPriorityPress = (priority: string) => {
    setSelectedPriority(priority);
    
    console.log("Selected Priority:", priority);
  };
  useEffect(() => {
  const formattedEndDate = formatTime(selectedEndTime);
  setFormattedSelectedEndTime(formattedEndDate);
  console.log(formattedSelectedEndTime)
}, [selectedEndTime]);
  



  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleEndTimeConfirm = (time: Date) => {
    setSelectedEndTime(time);
    const formattedEndDate = formatTime(time); // Use the passed time parameter
  setFormattedSelectedEndTime(formattedEndDate);
    hideEndTimePicker();
  };

  const addTodo = async () => {
    try {
      const formattedDate = selectedDate.toISOString(); // Format date to ISO string
      const docRef = await addDoc(collection(db, "todos"), {
        title: title,
        done: false,
        description:description,
        date: formattedDate,
        start:formattedSelectedStartTime,
        end:formattedSelectedEndTime,
        priority:selectedPriority
      });
      setTitle(''),
      setDescription(''),
      setFormattedSelectedEndTime(''),
      setFormattedSelectedStartTime(''),
      setSelectedPriority('')
      navigation.pop()
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  

  const handleStartTimeConfirm = (time: Date) => {
    setSelectedStartTime(time);
    const  formattedStartDate=formatTime(selectedStartTime)
   setFormattedSelectedStartTime(formattedStartDate)
    hideTimePicker();
  };
  

  const formatTime = (time: Date) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  };

  const convertToDateTime = (formattedTime: string) => {
    const [time, period] = formattedTime.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let hours24 = hours;
    if (period.toLowerCase() === "pm") {
      hours24 += 12;
    }
    const date = new Date();
    date.setHours(hours24, minutes);
    return date;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Pick Date" onPress={() => setDatePickerVisibility(true)} color={'black'} />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={date => {
            setSelectedDate(date);
            setDatePickerVisibility(false);
          }}
          onCancel={() => setDatePickerVisibility(false)}
        />
      <View style={styles.schedule}>
 <View style={styles.time}>
 <Button title="SELECT START TIME" onPress={showTimePicker} />
      <Text>Start Time: {formattedSelectedStartTime}</Text>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={hideTimePicker}
        date={selectedStartTime}
        // format="h:mm a" // Format time as "3:50 am"
      />
      </View>
      <View style={styles.time}>
      <Button title="Select End Time" onPress={showEndTimePicker} />
      <Text>End Time:{formattedSelectedEndTime} </Text>
      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
        date={selectedEndTime}
        // format="h:mm a" // Format time as "3:50 am"
      />
      </View>
      </View>
      <View style={styles.priorityContainer}>
        {priorityOptions.map((priority, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.priorityItem, selectedPriority === priority && styles.selectedPriorityItem]}
            onPress={() => onPriorityPress(priority)}
          >
            <Text style={selectedPriority===priority &&{color:'white'}}>{priority}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Add Task" onPress={addTodo} />
    </View>
  );
};

export default AddTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10
  },
  schedule:{flexDirection:'row', gap:5,alignItems:'center',justifyContent:'space-between',marginTop: 20},
  time:{flexDirection:'column'},
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  priorityItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5
  },
  selectedPriorityItem: {
    backgroundColor: 'blue',
    borderColor: 'blue'
  },
});
