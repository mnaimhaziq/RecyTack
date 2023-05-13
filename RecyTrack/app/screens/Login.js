import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/auth";

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useContext(AuthContext);

  const handleSubmit = async () => {
    if (email === "" || password === "") {
      alert("All fields are required");
      return;
    }

    try {
      console.log(email, password);
      const resp = await axios.post(
        "http://10.167.67.184:5000/api/users/login",
        {
          email,
          password,
        }
      );
      console.log(resp.data);
      setState(resp.data);
      await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
      alert("Sign In Successfull");
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
    }

    // if (resp.data.error){
    //   alert(resp.data.error)
    // } else
    //   setState(resp.data)
    //   await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
    //   alert("Login Successful");
    //   navigation.navigate("Home");
  };

  return (
    <View style={{ padding: 20, top: 0 }}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.loginText}>Login here</Text>
        <Text style={styles.welcomeText}>Welcome back you've been missed!</Text>
      </View>
      <View style={{ marginVertical: 30 }}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCompleteType="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          keyboardType="default"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          autoCompleteType="password"
        />
      </View>
      <Text style={{ marginHorizontal: 24 }}>
        {JSON.stringify({ email, password })}
      </Text>

      <View>
        <Text style={styles.forgotText}>Forgot your password ?</Text>
      </View>

      <TouchableOpacity style={styles.signinButton} onPress={handleSubmit}>
        <Text style={styles.signinText}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={{
          padding: 10,
        }}
      >
        <Text style={styles.createAccountText}>Create new account</Text>
      </TouchableOpacity>

      <View
        style={{
          marginVertical: 30,
        }}
      >
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "center",
          }}
        ></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

  loginText: {
    fontSize: 30,
    color: "green",
    marginVertical: 30,
    fontFamily: "poppins-bold",
  },

  welcomeText: {
    fontSize: 20,
    maxWidth: "60%",
    textAlign: "center",
    fontFamily: "poppins-semibold",
  },

  forgotText: {
    fontSize: 14,
    color: "green",
    alignSelf: "flex-end",
  },

  signinButton: {
    padding: 15,
    backgroundColor: "green",
    marginVertical: 30,
    borderRadius: 10,
    shadowColor: "green",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  signinText: {
    fontFamily: "poppins-bold",
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },

  registerButton: {
    padding: 10,
  },

  createAccountText: {
    fontFamily: "poppins-semibold",
    color: "black",
    textAlign: "center",
    fontSize: 14,
  },
});

export default Login;
