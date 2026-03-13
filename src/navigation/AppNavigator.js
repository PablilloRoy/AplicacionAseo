import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminScreen from '/src/screens/admin';
import DetailScreen from '/sec/screens/DetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
    <Stack.Screen name="Admin" component={AdminScreen} />
    <Stack.Screen name="Detalles" component={DetailScreen} />
    </Stack.Navigator>
);
}