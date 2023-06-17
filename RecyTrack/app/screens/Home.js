import { StyleSheet, Text, SafeAreaView, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import FooterList from "../components/footer/FooterList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  
  //const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      {user.isAdmin ? (
        <Text style={styles.mainText}>Welcome, {user.name}!</Text>
      ) : (
        <Text style={styles.mainText}>Welcome, {user.name}!</Text>
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
