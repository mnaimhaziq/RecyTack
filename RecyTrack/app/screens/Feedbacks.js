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
import { ScrollView } from "react-native";

import { getAllFeedback } from "../features/feedback/FeedbackFunction/FeedbackFunction";
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
      <DataTable style={styles.dataTable}>
        <DataTable.Header style={styles.header}>
          <DataTable.Title style={styles.shortCell}>
            <Text style={styles.headerText}>Name</Text>
          </DataTable.Title>
          <DataTable.Title style={styles.longCell}>
            <Text style={styles.headerText}>Comment</Text>
          </DataTable.Title>
          <DataTable.Title style={styles.longCell}>
            <Text style={styles.headerText}>Created At</Text>
          </DataTable.Title>
        </DataTable.Header>
        {/* Render feedback data */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {feedbacks && feedbacks.length > 0 ? (
            [...feedbacks]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort feedbacks by timestamp (newest first)
              .map((feedback, idx) => (
                <React.Fragment key={feedback._id}>
                  <DataTable.Row>
                    <DataTable.Cell style={styles.shortCell}>
                      {feedback.user.name}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.longCell}>
                      {feedback.comment}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.longCell}>
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
        </ScrollView>
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },
  dataTable: {
    width: "90%",
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#4CAF50",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  shortCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  longCell: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Feedbacks;
