import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

import { AuthProvider } from './app/context/auth';
import WelcomeScreen from './app/screens/WelcomeScreen';
import Login from './app/screens/Login';
import Register from './app/screens/Register'
import Home from './app/screens/Home';

const Stack = createNativeStackNavigator();

export default function App() {

  const [loaded] = useFonts({
    "poppins-bold": require("./app/assets/fonts/Poppins-Bold.ttf"),
    "poppins-semibold": require("./app/assets/fonts/Poppins-SemiBold.ttf"),
    "poppins": require("./app/assets/fonts/Poppins-Regular.ttf")
  });

  return (
    <NavigationContainer>
      <AuthProvider>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Welcome" component={WelcomeScreen}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Register" component={Register}/>
        <Stack.Screen name="Home" component={Home}/>
      </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
