import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import List from './app/screens/List';
import Details from './app/screens/Details';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useEffect } from 'react';
import AddTaskScreen from './app/screens/AddTask';
const Stack=createNativeStackNavigator();

export default function App() {
  useEffect(()=>{
    onAuthStateChanged;
  },[])
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='My Todos'>
        <Stack.Screen name='My Todos' component={List}/>
        <Stack.Screen name='Details' component={Details}/>
        <Stack.Screen name='AddTask' component={AddTaskScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
