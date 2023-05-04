import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function Register({ navigation }) {
  const [userImg, setUserImg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  const { name, email, password, confirmPassword, address } = formData;
  const { street, city, postalCode, country } = address;

  return (
    <SafeAreaView>
      <View style={{ padding: 20 }}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.createText}>Create account</Text>
          <Text style={styles.createSubText}>
            Create an account so you can explore all the existing jobs
          </Text>
        </View>
        <View style={{ marginVertical: 30 }}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            keyboardType="default"
          />
        </View>

        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={{
            padding: 10,
          }}
        >
          <Text style={styles.haveAccount}>Already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  createText: {
    fontSize: 30,
    color: "green",
    fontFamily: "poppins-bold",
    marginVertical: 30,
  },

  createSubText: {
    fontFamily: "poppins",
    fontSize: 14,
    maxWidth: "80%",
    textAlign: "center",
  },

  signUpButton: {
    padding: 20,
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

  signUpText: {
    fontFamily: "poppins-bold",
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },

  haveAccount: {
    fontFamily: "poppins-semibold",
    color: "black",
    textAlign: "center",
    fontSize: 14,
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Register;
