import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Picker,
  TextInput,
  TouchableOpacityComponent,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import FooterList from "../components/footer/FooterList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "react-native-paper";
import {
  Modal,
  Button,
  Provider,
  Portal,
  Dialog,
  IconButton,
  MD3Colors,
} from "react-native-paper";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { Select } from "native-base";

import {
  getAllRecycleLocation,
  getRecycleHistoryByUserId,
  createRecyclingHistory,
  deleteRecycleHistory,
  getRecycleHistoryById,
  updateRecycleHistoryById,
  getRecycleHistoryByUserIdAndPage,
} from "../features/recycle/recycleSlice";

const Recycling = () => {
  const [open, setOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedRow, setSelectedRow] = useState(null);
  const [visible, setVisible] = useState(false);

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const recycleLocations = useSelector(
    (state) => state.recycle.recycleLocations
  );

  const recyclingHistories = useSelector(
    (state) => state.recycle.recyclingHistoriesTop8
  );
  const recyclingHistory = useSelector(
    (state) => state.recycle.recycleHistoryById
  );

  const handleInfoButtonPress = (row) => {
    setSelectedRow(row);
    console.log(row); // Add this console log to check the row data
    handleShowModal();
  };

  const handleShowModal = () => {
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEditDialog(false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRecycleLocation(user.token));
    dispatch(
      getRecycleHistoryByUserIdAndPage({
        id: user._id,
        page,
        token: user.token,
      })
    );
    setTotalPages(recyclingHistories.pages);
  }, [dispatch, user.token, page, user._id, recyclingHistories.pages]);

  const handlePageChange = (event, value) => {
    console.log("Page changed:", value);
    setPage(value);
  };

  const handleEdit = async (id) => {
    await dispatch(getRecycleHistoryById({ id, token: user.token }));
    setOpenEditDialog(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this recycling history?")
    ) {
      await dispatch(deleteRecycleHistory({ id, token: user.token })).then(
        () => {
          dispatch(
            getRecycleHistoryByUserIdAndPage({
              id: user._id,
              page,
              token: user.token,
            })
          );
        }
      );
      Toast.show({
        type: "error",
        text1: "Recycling History has been deleted",
      });
    }
  };

  const initialValues = {
    recyclingLocationId: "",
    recyclingMethod: "",
    quantity: "",
    wasteType: "",
  };

  const [values, setValues] = useState({
    recyclingLocationId: "",
    recyclingMethod: "",
    quantity: "",
    wasteType: "",
  });

  const handleChanges = (field, value) => {
    setValues((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Perform form submission logic
    // You can access the form values from the 'values' state
    console.log("Form values:", values);
  };

  const validationSchema = Yup.object().shape({
    recyclingLocationId: Yup.string().required("This field is Required"),
    recyclingMethod: Yup.string().required("This field is Required"),
    quantity: Yup.number()
      .typeError("Must be a number")
      .required("This field is Required"),
  });

  const calculateQuantity = (quantity, wasteType) => {
    let conversionFactor;

    if (wasteType === "Bottle") {
      conversionFactor = 0.025;
    } else if (wasteType === "Can") {
      conversionFactor = 0.01;
    } else {
      conversionFactor = 1;
    }

    const quantityInKg = quantity * conversionFactor;
    return parseFloat(quantityInKg.toFixed(2));
  };

  const reverseCalculateQuantity = (quantityInKg, wasteType) => {
    let conversionFactor;

    if (wasteType === "Bottle") {
      conversionFactor = 0.025;
    } else if (wasteType === "Can") {
      conversionFactor = 0.01;
    } else {
      conversionFactor = 1;
    }

    const quantity = Math.round(quantityInKg / conversionFactor);
    return quantity;
  };

  const onSubmit = async (values) => {
    const { recyclingLocationId, recyclingMethod, quantity, wasteType } =
      values;

    const newFormData = {
      recyclingLocationId,
      recyclingMethod,
      quantity: calculateQuantity(quantity, wasteType),
      wasteType,
    };

    await dispatch(
      createRecyclingHistory({ newFormData, token: user.token })
    ).then(() => {
      dispatch(
        getRecycleHistoryByUserIdAndPage({
          id: user._id,
          page,
          token: user.token,
        })
      );
    });
    Toast.show({
      type: "success",
      text1: "New Recycling History has been created",
    });
    resetForm();
    setOpen(false);
  };

  const onSubmitEdit = async (values, { resetForm }) => {
    const { recyclingLocationId, recyclingMethod, quantity, wasteType } =
      values;

    const newFormData = {
      recyclingLocationId,
      recyclingMethod,
      quantity: calculateQuantity(quantity, wasteType),
      wasteType,
    };

    const id = recyclingHistory._id;

    await dispatch(
      updateRecycleHistoryById({ id, newFormData, token: user.token })
    );
    dispatch(
      getRecycleHistoryByUserIdAndPage({
        id: user._id,
        page,
        token: user.token,
      })
    );
    toast.success("Recycling History Has Been Edited ");
    resetForm();
    setOpenEditDialog(false);
  };



  const [selectedValue, setSelectedValue] = useState("");

  return (
    <View style={styles.container}>
      <Provider>
        <Portal>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>RECYCLING HISTORY</Text>
            <View style={styles.buttonContainer}>
              <Button style={styles.createButton} onPress={handleClickOpen}>
                Create
              </Button>
            </View>
          </View>

          {/* Render the Dialog */}

          {open && (
            <View style={styles.overlay}>
              {/* Render the Dialog here */}
              <Dialog visible={open} onClose={handleClose}>
                <Dialog.Title>Add New Recycling History</Dialog.Title>
                <Dialog.Content>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    {({
                      values,
                      handleChange,
                      handleSubmit,
                      errors,
                      touched,
                    }) => (
                      <View style={styles.container}>
                        <View style={styles.formControl}>
                          <Picker
                            selectedValue={values.recyclingLocationId}
                            onValueChange={handleChange}
                          >
                            {recycleLocations.data
                              .slice()
                              .sort((a, b) =>
                                a.locationName.localeCompare(b.locationName)
                              )
                              .map((data) => (
                                <Picker.Item
                                  key={data._id}
                                  label={data.locationName}
                                  value={data._id}
                                />
                              ))}
                          </Picker>
                          <Text style={styles.label}>Recycling Location</Text>
                        </View>

                        <View style={styles.formControl}>
                          <Picker
                            selectedValue={values.recyclingMethod}
                            onValueChange={handleChange}
                          >
                            <Picker.Item
                              label="Curbside Recycling"
                              value="curbside"
                            />
                            <Picker.Item
                              label="Drop-off Recycling"
                              value="drop-off"
                            />
                            <Picker.Item
                              label="Composting"
                              value="composting"
                            />
                            <Picker.Item
                              label="E-waste Recycling"
                              value="E-waste Recycling"
                            />
                          </Picker>
                          <Text style={styles.label}>Recycling Method</Text>
                        </View>

                        <View style={styles.formControl}>
                          <Picker
                            selectedValue={values.wasteType}
                            onValueChange={(value) =>
                              handleChange("wasteType", value)
                            }
                          >
                            <Picker.Item label="Plastic" value="Plastic" />
                            <Picker.Item label="Paper" value="Paper" />
                            <Picker.Item label="Glass" value="Glass" />
                            <Picker.Item label="Metal" value="Metal" />
                            <Picker.Item label="Bottle" value="Bottle" />
                            <Picker.Item label="Can" value="Can" />
                          </Picker>
                          <Text style={styles.label}>Waste Type</Text>
                        </View>

                        <TextInput
                          label="Quantity"
                          onChangeText={(value) =>
                            handleChange("quantity", value)
                          }
                          value={values.quantity}
                          style={styles.formControl}
                        />

                        <View style={styles.dialogActions}>
                          <TouchableOpacity
                            onPress={handleClose}
                            style={[styles.button, styles.cancelButton]}
                          >
                            <Text style={styles.buttonText}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={handleSubmit}
                            style={[styles.button, styles.createButton]}
                          >
                            <Text style={styles.buttonText}>Create</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </Formik>
                </Dialog.Content>
                <Dialog.Actions></Dialog.Actions>
              </Dialog>
            </View>
          )}

          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={styles.longCell}>
                Location
              </DataTable.Title>
              <DataTable.Title style={styles.longCell}>Method</DataTable.Title>
              <DataTable.Title style={styles.shortCell}>Type</DataTable.Title>
              {/* <DataTable.Title style={styles.shortCell} numeric>
            Quantity(kg)
          </DataTable.Title> */}
              {/* <DataTable.Title>Create At</DataTable.Title> */}
            </DataTable.Header>

            {recyclingHistories.data &&
              recyclingHistories.data.map((row, idx) => (
                <React.Fragment key={row._id}>
                  <DataTable.Row onPress={() => handleInfoButtonPress(row)}>
                    <DataTable.Cell style={styles.longCell}>
                      {row.recyclingLocation
                        ? row.recyclingLocation.locationName
                        : "null"}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.longCell}>
                      {row.recyclingMethod}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.shortCell}>
                      {row.wasteType}
                    </DataTable.Cell>
                  </DataTable.Row>
                </React.Fragment>
              ))}

            <DataTable.Pagination
              count={totalPages}
              page={page}
              onPageChange={handlePageChange}
              siblingCount={1}
              showFirstButton
              showLastButton
            />
          </DataTable>

          {/* Render the Modal */}

          <Modal
            visible={visible}
            onDismiss={handleCloseModal}
            contentContainerStyle={styles.modalContainer}
          >
            <Text>Full Recycling History Information</Text>
            <Text>
              Recycling Location:{" "}
              {selectedRow && selectedRow.recyclingLocation.locationName}
            </Text>
            <Text>
              Recycling Method: {selectedRow && selectedRow.recyclingMethod}
            </Text>
            <Text>
              Recycling Waste Type: {selectedRow && selectedRow.wasteType}
            </Text>
            <Text>Quantity: {selectedRow && selectedRow.quantity}</Text>
            <Text>
              Created at:{" "}
              {selectedRow && new Date(selectedRow.createdAt).toLocaleString()}
            </Text>

            <View style={styles.modalButtonContainer}>
              <Button style={styles.modalButton}>Edit</Button>
              <Button style={styles.modalButton} onPress={() => handleDelete(selectedRow && selectedRow._id)}>Delete</Button>
            </View>
          </Modal>
        </Portal>
      </Provider>

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

  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "lightblue",
    height: 42,
    width: 200,
  },

  longCell: {
    flex: 2, // Make the cell longer
  },

  shortCell: {
    flex: 1, // Make the cell shorter
  },

  modalContainer: {
    backgroundColor: "white",
    padding: 70,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },

  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  infoCell: {
    alignItems: "center",
    justifyContent: "center",
  },

  infoButtonText: {
    color: "blue",
    textDecorationLine: "underline",
  },

  modalButtonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },

  modalButton: {
    marginHorizontal: 5,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 10,
    marginTop: 15,
  },
  createButton: {
    // Add any styles specific to the create button
  },
  dialogContainer: {
    zIndex: 9999, // Set a high z-index value
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
  formControl: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dialogActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#e57373",
  },
  createButton: {
    backgroundColor: "#4caf50",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default Recycling;
