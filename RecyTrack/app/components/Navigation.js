import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import NavigationScreen from "./NavigationScreen";
import { AuthProvider } from "../context/auth";

const Navigation = () => {
  return (
    <NavigationContainer>
      <NavigationScreen />
    </NavigationContainer>
  );
};

export default Navigation;
