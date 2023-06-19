import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FontAwesome } from "@expo/vector-icons";
import { useWindowDimensions } from 'react-native';

const FooterItem = ({ name, text, handlePress, screenName, routeName }) => {
  const { width } = useWindowDimensions();
  const isActiveScreen = screenName && routeName && screenName === routeName;
  // Define the desired icon family and component based on the name
  let IconComponent = MaterialIcons; // Default icon family
  let iconName = name;

  if (name === "recycle") {
    // Change the icon family and name for the "RecyclingHistory" item
    IconComponent = FontAwesome;
    iconName = "recycle"; // Update the icon name from the new family
  }

  const isSmallDevice = width < 375; // Adjust the threshold as needed for smaller devices

  return (
    <TouchableOpacity
    style={[
      styles.footerItem,
      isActiveScreen && styles.activeFooterItem,
      isSmallDevice && styles.smallDevice,
    ]}
      onPress={handlePress}
    >
      <>
      <View style={styles.iconContainer}>
        <IconComponent
          name={name}
          size={25}
          style={styles.fontStyle}
          color={isActiveScreen ? '#4CAF50' : 'black'}
        />
        </View>
        {text && <Text style={styles.iconText}>{text}</Text>}
      </>
    </TouchableOpacity>
    
  );
};

const styles = StyleSheet.create({
  footerItem: {
    alignItems: 'center',
  },
  activeFooterItem: {
    alignItems: 'center',
  },
  smallDevice: {
    paddingHorizontal: 5, // Adjust the spacing for smaller devices
  },
  iconContainer: {
    marginBottom: 3,
    alignSelf: 'center',
  },
  iconText: {
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export default FooterItem;
