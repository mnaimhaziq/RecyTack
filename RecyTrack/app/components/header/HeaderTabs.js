import { TouchableOpacity, SafeAreaView } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../context/auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HeaderTabs = () => {
  const [state, setState] = useContext(AuthContext);

  const signOut = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("auth-rn");
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={signOut}>
        <MaterialIcons name="logout" size={25} color="darkmagenta" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HeaderTabs;
