import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/auth";
import HeaderTabs from "./header/HeaderTabs";
import { useSelector } from "react-redux";
import { Header } from "react-native-elements"; // Import Header component from react-native-elements
import { MaterialIcons } from "@expo/vector-icons";

import Login from "../screens/Login";
import Register from "../screens/Register";
import Home from "../screens/Home";
import Recycling from "../screens/Recycling";
import Account from "../screens/Account";
import Feedbacks from "../screens/Feedbacks";

const Stack = createNativeStackNavigator();

const NavigationScreen = () => {
  // const [state, setState] = useContext(AuthContext);
  // const auth = state && state.token !== "" && state.user !== null;

  const auth = useSelector((state) => {
    const { token, user } = state.auth;
    return token !== "" && user !== null;
  });

  return (
    <Stack.Navigator>
      {auth ? (
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerRight: () => <HeaderTabs />,
              headerStyle: { backgroundColor: "#4CAF50" },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="Recycling"
            component={Recycling}
            options={{
              headerStyle: { backgroundColor: "#4CAF50" },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="Account"
            component={Account}
            options={{
              headerStyle: { backgroundColor: "#4CAF50" },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="Feedbacks"
            component={Feedbacks}
            options={{
              headerStyle: { backgroundColor: "#4CAF50" },
              headerTintColor: "white",
            }}
          />
        </>
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
