import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FooterItem from "./FooterItem";

const FooterList = () => {
  return (
    <View style={styles.container}>
      <FooterItem text="Home" name="home" />
      <FooterItem text="RecyclingHistory" name="history" />
      <FooterItem text="Education" name="library-books" />
      <FooterItem text="Leaderboard" name="leaderboard" />
      <FooterItem text="Account" name="account-circle" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    marginHorizontal: 30,
    justifyContent: "space-between",
  },
});

export default FooterList;
