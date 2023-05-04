import { StyleSheet, Text, SafeAreaView, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import FooterList from "../components/footer/FooterList";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getAdminStatus = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("auth-rn");
        const value = JSON.parse(jsonValue);
        setIsAdmin(value.isAdmin);
      } catch (e) {
        console.error("Failed to get admin status from AsyncStorage", e);
      }
    };
    getAdminStatus();
  }, []);

  return (
    <View style={styles.container}>
      {isAdmin ? (
        <Text style={styles.mainText}>Welcome, Admin!</Text>
      ) : (
        <Text style={styles.mainText}>Welcome, User!</Text>
      )}
      <FooterList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },

  mainText: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 30,
  },
});

export default Home;
