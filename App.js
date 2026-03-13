import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa tus pantallas
import SplashScreen from './src/screens/SplashScreen'; 
import LoginScreen from './src/screens/LoginScreen';
import AdminScreen from './src/screens/admin';
import ClassmateIndex from './src/screens/Classmate-index';
// Supongamos que tienes una para alumnos, si no, cámbiala por la que uses
// import AlumnoScreen from './src/screens/AlumnoScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
         <Stack.Screen name="Alumno" component={ClassmateIndex} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}