import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider } from "react-redux";
import { store } from "./app/features/store";
import Toast from 'react-native-toast-message';
import { NativeBaseProvider, Box } from "native-base";

import Navigation from "./app/components/Navigation";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    "poppins-bold": require("./app/assets/fonts/Poppins-Bold.ttf"),
    "poppins-semibold": require("./app/assets/fonts/Poppins-SemiBold.ttf"),
  });

  return (
    <Provider store={store}>
      <NativeBaseProvider>
      <RootSiblingParent>
        <Navigation />
      </RootSiblingParent>
      <Toast />
      </NativeBaseProvider>
    </Provider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
