import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TextInput, FlatList, TouchableOpacity, Pressable } from "react-native";
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import {AntDesign,Ionicons,Entypo} from '@expo//vector-icons'

export interface Todo {
  title: string;
  description:string;
  done: boolean;
  id: string;
  date: Date;
  
}

const List = ({navigation}:any) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState("");
  const [index,setIndex]=useState(0)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'todos'), snapshot => {
      const todosData: Todo[] = [];
      snapshot.forEach(doc => {
        todosData.push({
          id: doc.id,
          ...doc.data()
        } as Todo);
      });
      setTodos(todosData);
    });
    return unsubscribe;
  }, []);

  
  const renderTodo = ({ item }: { item: Todo }) => {
    const toggleDone = async () => {
      const todoRef = doc(db, `todos/${item.id}`);
      await updateDoc(todoRef, { done: !item.done });
    };

    const deleteItem = async () => {
      const todoRef = doc(db, `todos/${item.id}`);
      await deleteDoc(todoRef);
    };
    const navigateToDetail = () => {
      navigation.navigate('Details',{todo:item});
    };
    return (
      <Pressable style={styles.todoContainer} onPress={navigateToDetail}>
        <TouchableOpacity  style={styles.todo}>
          {item.done && <Ionicons name="checkmark-circle" size={32} color="green" onPress={toggleDone}/>}
          {!item.done && <Entypo name="circle" size={32} color="black" onPress={toggleDone}/>}
        <View style={styles.text}>
          <Text style={styles.todoText}>{item.title}</Text>
          <Text style={styles.todoText}>{item.description}</Text>
          </View>
        </TouchableOpacity>
        <Entypo name="trash" size={32} color="red"onPress={deleteItem} />
      </Pressable>
    );
  };

  const categorizeTodos = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTodos: Todo[] = [];
    const tomorrowTodos: Todo[] = [];
    const upcomingTodos: Todo[] = [];

    todos.forEach(todo => {
      const todoDate = new Date(todo.date);
      if (format(todoDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
        todayTodos.push(todo);

      } else if (format(todoDate, "yyyy-MM-dd") === format(tomorrow, "yyyy-MM-dd")) {
        tomorrowTodos.push(todo);
      } else if (todoDate > tomorrow) {
        upcomingTodos.push(todo);
      }
    });
    return [
      { title: 'Today', data: todayTodos, showTitle: todayTodos.length > 0 },
      { title: 'Tomorrow', data: tomorrowTodos, showTitle: tomorrowTodos.length > 0 },
      { title: 'Upcoming', data: upcomingTodos, showTitle: upcomingTodos.length > 0 }
    ];
  };
  const navigateToAddTask = () => {
    navigation.navigate('AddTask');
  };
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Your Todo List</Text>
      </View>
      <FlatList
        data={categorizeTodos()}
        renderItem={({ item }) => (
          <View>
            {item.showTitle && <Text>{item.title}</Text>}
            <FlatList
              data={item.data}
              renderItem={({ item }) => renderTodo({ item })}
              keyExtractor={item => item.id}
            />
          </View>
        )}
        keyExtractor={item => item.title}
      />
      <TouchableOpacity style={styles.floatingButton} onPress={navigateToAddTask}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    padding: 20
  },
  form: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    gap: 5
  },
  title:{
    fontSize:20
  }
  ,
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 3
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 4,
    backgroundColor: '#fff',
  },
  text:{
flexDirection:'column',
paddingLeft:20,
gap:2
  },
  todoText: {
    flex: 1,
    paddingHorizontal: 4
  },

  todo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    elevation: 8
  }
});
