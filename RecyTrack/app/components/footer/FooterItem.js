import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FontAwesome } from "@expo/vector-icons";

const FooterItem = ({ name, text, handlePress, screenName, routeName }) => {
  const activeScreenColour = screenName === routeName && "darkblue";

  // Define the desired icon family and component based on the name
  let IconComponent = MaterialIcons; // Default icon family
  let iconName = name;

  if (name === 'recycle') {
    // Change the icon family and name for the "RecyclingHistory" item
    IconComponent = FontAwesome;
    iconName = 'recycle'; // Update the icon name from the new family
  }
 

  return (
    <TouchableOpacity onPress={handlePress}>
      <>
        <IconComponent
          name={name}
          size={25}
          style={styles.fontStyle}
          color={activeScreenColour}
        />

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
