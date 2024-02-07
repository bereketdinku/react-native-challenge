import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View,Text,TextInput,Button ,StyleSheet, TouchableOpacity} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
const Details = ({ route, navigation }:any) => {
    const { todo } = route.params;
    console.log(todo)
    const [editedTodo, setEditedTodo] = useState(todo.title);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [description, setDescription] = useState(todo.description);
    const [selectedPriority, setSelectedPriority] = useState<string | undefined>();
    const [selectedStartTime, setSelectedStartTime] = useState(new Date());
    const [selectedEndTime, setSelectedEndTime] = useState(new Date());
    const [formattedSelectedStartTime, setFormattedSelectedStartTime] = useState("");
    const [formattedSelectedEndTime, setFormattedSelectedEndTime] = useState("");
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
    const priorityOptions = ['High', 'Medium', 'Low'];

  const onPriorityPress = (priority: string) => {
    setSelectedPriority(priority);
    
    console.log("Selected Priority:", priority);
  };
    useEffect(()=>{
        if(!selectedDate){
            setSelectedDate(todo.date)
        }
        if(!formattedSelectedStartTime){
            setFormattedSelectedStartTime(todo.start)

        }
        if(!formattedSelectedEndTime){
            setFormattedSelectedEndTime(todo.end)
        }
        if(!selectedPriority){
            setSelectedPriority(todo.priority)
        }
    },[todo])
  const saveChanges =async () => {
    
    const formattedDate = selectedDate.toISOString();
    const todoRef = doc(db, `todos/${todo.id}`);
      await updateDoc(todoRef, { done: !todo.done,title:editedTodo,date:formattedDate,description:description,start:formattedSelectedStartTime,end:formattedSelectedEndTime,priority:selectedPriority });
      navigation.pop()
  };
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
    return ( <View style={styles.container}>
        <Text style={styles.title}>Edit Todo</Text>
        
        <TextInput
          style={styles.input}
          value={editedTodo}
          onChangeText={text => setEditedTodo(text)}
        />
         <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.form}>
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
        <Button title="Save Changes" onPress={saveChanges} />
        </View>
      </View> );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
        padding: 20
      },
      title:{
        fontSize:22,
        padding:10
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
    form: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 5,
        // padding: 20,
        gap: 5
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
export default Details;