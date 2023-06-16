import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FooterItem from "./FooterItem";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const FooterList = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      <FooterItem
        text="Home"
        name="home"
        handlePress={() => navigation.navigate("Home")}
        routeName={route.name}
      />
      <FooterItem
        text="RecyclingHistory"
        name="recycle"
        handlePress={() => navigation.navigate("Recycling")}
        routeName={route.name}
      />
      <FooterItem text="Education" name="library-books" />
      <FooterItem text="Leaderboard" name="leaderboard" />
      <FooterItem
        text="Account"
        name="account-circle"
        handlePress={() => navigation.navigate("Account")}
        routeName={route.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    marginHorizontal: 30,
    justifyContent: "space-between",
    // backgroundColor: "darkgreen",
  },
});

export default FooterList;
