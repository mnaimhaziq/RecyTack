import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
//import DocumentPicker from "react-native-document-picker";
//import RNFS from "react-native-fs";

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

  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { user, isLoading, isSuccess, isError, message } = auth;

  console.log(auth);

  const handleImageUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      const fileUri = res.uri;
      const fileContent = await RNFS.readFile(fileUri, "base64");

      setUserImg(fileContent); // Assuming setUserImg is your state setter function
    } catch (error) {
      console.log(error);
    }
  };

  // const TransformFileData = (file) => {
  //   const reader = new FileReader();

  //   if (file) {
  //     reader.readAsDataURL(file);
  //     reader.onloadend = () => {
  //       setUserImg(reader.result);
  //     };
  //   } else {
  //     setUserImg("");
  //   }
  // };

  useEffect(() => {
    if (isSuccess || user) {
      navigation.navigate("Home");
    }
  }, [user, isError, isSuccess, message, navigation, dispatch]);

  const submitHandler = (e) => {
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
      dispatch(register(userData));
    }
  };

  const onChange = (e) => {
    if (e.target.name.startsWith("address.")) {
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [e.target.name.split(".")[1]]: e.target.value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 20, backgroundColor:"verylightgrey"}}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.createText}>Create account</Text>
          <Text style={styles.createSubText}>
            Create an account so you can get started on your recycling journey!
          </Text>
        </View>
        <View style={{ marginVertical: 30 }}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="default"
            name="email"
            value={email}
            onChange={onChange}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            keyboardType="default"
            name="password"
            value={password}
            onChange={onChange}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            keyboardType="default"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
          />
          {/* <Button title="Upload Image" onPress={handleImageUpload} /> */}
          <TextInput
            style={styles.input}
            placeholder="Enter Street"
            keyboardType="default"
            name="address.street"
            value={formData.address.street}
            onChange={onChange}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter City"
            keyboardType="default"
            name="address.city"
            value={formData.address.city}
            onChange={onChange}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Postal Code"
            keyboardType="default"
            name="address.code"
            value={formData.address.code}
            onChange={onChange}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Country"
            keyboardType="default"
            name="address.country"
            value={formData.address.country}
            onChange={onChange}
          />
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={submitHandler}>
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
