import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Home from "../screens/Home";
import { AuthContext } from "../context/auth";
import HeaderTabs from "./header/HeaderTabs";

const Stack = createNativeStackNavigator();

const NavigationScreen = () => {
  const [state, setState] = useContext(AuthContext);
  const auth = state && state.token !== "" && state.user !== null;

  return (
    <Stack.Navigator initialRouteName="Home">
      {auth ? (
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerRight: () => <HeaderTabs /> }}
        />
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default NavigationScreen;
