import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  Image,
} from "react-native";
import { ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import defaultImage from "../assets/recycleicon.png";


//import DocumentPicker from "react-native-document-picker";
//import RNFS from "react-native-fs";

function Register({ navigation }) {
  const [userImg, setUserImg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userImg: userImg,
    address: {
      street: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  const { name, email, password, confirmPassword, address } = formData;
  const { street, city, postalCode, country } = address;

  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { user, isLoading, isSuccess, isError, message } = auth;

  useEffect(() => {
    if (isSuccess || user) {
      navigation.navigate("Home");
    }
  }, [user, isError, isSuccess, message, navigation, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      name === "" ||
      password === "" ||
      email === "" ||
      confirmPassword === "" ||
      userImg === "" ||
      street === "" ||
      city === "" ||
      postalCode === "" ||
      country === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Password do not match");
    } else {
      const userData = {
        name,
        email,
        password,
        picture: userImg,
        address: {
          street: street,
          city: city,
          postalCode: postalCode,
          country: country,
        },
      };
      console.log(JSON.stringify(userData));
      // await dispatch(register(userData));
    }
  };

  const onChange = (value, name) => {
    if (name.startsWith("address.")) {
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [name.split(".")[1]]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.createText}>Create account</Text>
        <Text style={styles.createSubText}>
          Create an account so you can get started on your recycling journey!
        </Text>
      </View>
      <ScrollView>
        <View style={{ marginVertical: 30 }}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            keyboardType="default"
            name="name"
            value={name}
            onChangeText={(text) => onChange(text, "name")}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="default"
            name="email"
            value={email}
            onChangeText={(text) => onChange(text, "email")}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            keyboardType="default"
            name="password"
            value={password}
            onChangeText={(text) => onChange(text, "password")}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            keyboardType="default"
            name="confirmPassword"
            value={confirmPassword}
            onChangeText={(text) => onChange(text, "confirmPassword")}
          />

          <TouchableOpacity onPress={handleImageUpload}>
            <Text>Select Image</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Enter Street"
            keyboardType="default"
            name="address.street"
            value={formData.address.street}
            onChangeText={(text) => onChange(text, "address.street")}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter City"
            keyboardType="default"
            name="address.city"
            value={formData.address.city}
            onChangeText={(text) => onChange(text, "address.city")}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Postal Code"
            keyboardType="default"
            name="address.postalCode"
            value={formData.address.postalCode}
            onChangeText={(text) => onChange(text, "address.postalCode")}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Country"
            keyboardType="default"
            name="address.country"
            value={formData.address.country}
            onChangeText={(text) => onChange(text, "address.country")}
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.signUpButton} onPress={() => console.log(formData)}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor: "#FFFFF",
  },
  createText: {
    fontSize: 30,
    color: "green",
    fontFamily: "poppins-bold",
    marginVertical: 30,
  },

  createSubText: {
    fontFamily: "poppins-semibold",
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
