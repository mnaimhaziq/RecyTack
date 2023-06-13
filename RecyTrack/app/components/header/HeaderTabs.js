import { TouchableOpacity, SafeAreaView } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../context/auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { logout, resetUser } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

const HeaderTabs = () => {
  //const [state, setState] = useContext(AuthContext);
  const auth = useSelector((state) => state.auth);
  const { user, isLoading, isSuccess, isError } = auth;

  const dispatch = useDispatch();

  const signOut = async () => {
    //setState({ token: "", user: null });
    dispatch(logout());
    dispatch(resetUser());
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
