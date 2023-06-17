import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "react-native-paper";

import {
  createFeedback,
  getAllFeedback,
} from "../features/feedback/FeedbackFunction/FeedbackFunction";
import FooterList from "../components/footer/FooterList";

const Feedbacks = () => {
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const feedback = useSelector((state) => state.feedback);
  const { feedbacks } = feedback;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllFeedback(user.token));
  }, [dispatch, user.token]);

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Comment</DataTable.Title>
          <DataTable.Title>Created At</DataTable.Title>
          <DataTable.Title></DataTable.Title>
        </DataTable.Header>
        {feedbacks && feedbacks.length > 0 ? (
          feedbacks.map((feedback, idx) => (
            <React.Fragment key={feedback._id}>
              <DataTable.Row>
                <DataTable.Cell>{feedback.user.name}</DataTable.Cell>
                <DataTable.Cell>{feedback.comment}</DataTable.Cell>
                <DataTable.Cell>
                  {new Date(feedback.timestamp).toLocaleString()}
                </DataTable.Cell>
              </DataTable.Row>
            </React.Fragment>
          ))
        ) : (
          <DataTable.Row>
            <DataTable.Cell>No feedbacks available</DataTable.Cell>
          </DataTable.Row>
        )}
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  //   footer: {
  //     justifyContent: "flex-end",
  //   },
});

export default Feedbacks;
