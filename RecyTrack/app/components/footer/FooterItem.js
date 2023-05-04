import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const FooterItem = ({ name, text }) => {
  return (
    <TouchableOpacity>
      <>
        <MaterialIcons name={name} size={25} style={styles.fontStyle} />
      </>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fontStyle: {
    marginBottom: 3,
    alignSelf: "center",
  },

  iconText: {
    fontSize: 12,
    textAlign: "center",
    textTransform: "uppercase",
  },
});

export default FooterItem;
