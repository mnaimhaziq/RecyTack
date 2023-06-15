import {
  StyleSheet,
  SafeAreaView,
  View,
  Picker,
  TextInput,
  TouchableOpacity,
  TouchableOpacityComponent,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Card, Text} from "react-native-paper";

import FooterList from "../components/footer/FooterList";

const Account = () => {
  const [editMode, setEditMode] = useState(false);

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const dispatch = useDispatch();

  const initialValues = {
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    phoneNumber: user.phoneNumber,
    street: user.address.street,
    city: user.address.city,
  };

  const handleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleChange = (name, value) => {
    const newValues = { ...initialValues, [name]: value };
    dispatch({
      type: "UPDATE_USER_INFO",
      payload: newValues,
    });
  };

  const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title
          title="My Profile"
          left={LeftContent}
        />
        <Card.Content>
          <Text variant="titleLarge">Card title</Text>
          <Text variant="bodyMedium">Card content</Text>
          <Avatar.Image size={24} source={user.picture.url} />
        </Card.Content>
        <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
        <Card.Actions>
          <Button>Cancel</Button>
          <Button>Ok</Button>
        </Card.Actions>
      </Card>
      <FooterList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    height: 40,
    backgroundColor: "lightgray",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: 10,
  },
  input: {
    width: 200,
    height: 40,
  },
  name: {
    fontSize: 16,
  },
  email: {
    fontSize: 16,
  },
  isAdmin: {
    fontSize: 16,
  },
  phoneNumber: {
    fontSize: 16,
  },
  street: {
    fontSize: 16,
  },
  city: {
    fontSize: 16,
  },
});

export default Account;
