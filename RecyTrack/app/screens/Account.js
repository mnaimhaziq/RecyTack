import {
  StyleSheet,
  SafeAreaView,
  View,
  Picker,
  TouchableOpacity,
  TouchableOpacityComponent,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Button,
  Card,
  Text,
  TouchableRipple,
  Dialog,
  Provider,
  Portal,
  TextInput,
} from "react-native-paper";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import FooterList from "../components/footer/FooterList";
import { createFeedback } from "../features/feedback/FeedbackFunction/FeedbackFunction";

const Account = ({ navigation }) => {
  const [editMode, setEditMode] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const feedback = useSelector((state) => state.feedback);
  // const { feedbacks } = feedback;

  const [comment, setComment] = useState({
    comment: "",
  });

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

  const handleClickOpen = () => {
    setOpenFeedbackDialog(true);
  };

  const handleClose = () => {
    setOpenFeedbackDialog(false);
  };

  const submitHandler = async (comment) => {
    if (comment === "") {
      Toast.show({
        type: "error",
        text1: "Please fill in all required fields.",
      });
      return;
    } else {
      const feedback = {
        comment,
      };

      console.log(feedback);

      await dispatch(createFeedback({ feedback, token: user.token }));
      Toast.show({
        type: "success",
        text1: "Thank you, your feedback has been sent",
      });
      handleClose();
    }
  };

  const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

  return (
    <View style={styles.container}>
      <Provider>
        <Portal>
          <View style={styles.cardContainer}>
            <Card>
              <Card.Title title="My Profile" titleStyle={styles.cardTitle} />
              <Card.Content style={styles.content}>
                <Avatar.Image size={100} source={user.picture.url} />
                <Text style={styles.cardContent}>{user.name}</Text>
              </Card.Content>
              <Card.Actions>
                <Button buttonColor="green" textColor="white">
                  Edit Profile
                </Button>
              </Card.Actions>
            </Card>
          </View>

          {!user.isAdmin && (
            <View>
              <TouchableRipple
                onPress={handleClickOpen}
                rippleColor="rgba(0, 0, 0, .32)"
                style={styles.sendFeedbackButton}
              >
                <Card style={styles.sendFeedbackCard}>
                  <Card.Content>
                    <Text style={styles.sendFeedbackText}>Send Feedback</Text>
                  </Card.Content>
                </Card>
              </TouchableRipple>
            </View>
          )}

          {user.isAdmin && (
            <View>
              <TouchableRipple
              onPress={() => navigation.navigate("Feedbacks")}
              rippleColor="rgba(0, 0, 0, .32)"
              style={styles.sendFeedbackButton}
              >
                <Card style={styles.sendFeedbackCard}>{/* Admin-specific content */}
                <Card.Content>
                  <Text style={styles.sendFeedbackText}>View Feedback</Text>
                </Card.Content>
                </Card>
              </TouchableRipple>
            </View>
          )}
          <View style={styles.footer}>
            <FooterList />
          </View>

          {/* Render the Feedback Dialog */}
          {openFeedbackDialog && (
            <View style={styles.overlay}>
              {/* Render the Dialog here */}
              <Dialog visible={openFeedbackDialog} onClose={handleClose}>
                <Dialog.Title>Send a feedback</Dialog.Title>
                <Dialog.Content>
                  <TextInput
                    placeholder="Enter your comment"
                    // value={comment}
                    onChangeText={(text) => setComment(text)}
                    style={styles.textInput}
                    mode="outlined"
                    multiline="true"
                    theme={{
                      colors: {
                        primary: "#6200EE",
                        underlineColor: "transparent",
                      },
                    }}
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={handleClose}>Cancel</Button>
                  <Button onPress={() => submitHandler(comment)}>Create</Button>
                </Dialog.Actions>
              </Dialog>
            </View>
          )}
        </Portal>
      </Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 20,
    marginTop: 8,
  },
  text: {
    fontSize: 16,
  },
  cardContainer: {
    flex: 1,
  },
  footer: {
    justifyContent: "flex-end",
  },
  sendFeedbackButton: {
    flex: 1,
  },
  sendFeedbackCard: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  sendFeedbackText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Adjust the opacity as desired
    zIndex: 9999,
    // Add any other necessary styles
  },
  textInput: {
    marginBottom: 16,
    backgroundColor: "white",
  },
});

export default Account;
