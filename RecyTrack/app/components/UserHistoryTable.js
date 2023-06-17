import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Picker } from "react-native";
import { DataTable } from "react-native-paper";
import {
  Modal,
  Button,
  Provider,
  Portal,
  Dialog,
  IconButton,
  MD3Colors,
  TextInput,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "native-base";
import { Dimensions } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import {
  createRecyclingHistory,
  deleteRecycleHistory,
  getAllRecyclingHistories,
  updateRecycleHistoryById,
  getRecycleHistoryById,
} from "../features/recycle/recycleSlice";
import { getAllRecycleLocation } from "../features/recycle/recycleSlice";
import { getAllUsers } from "../features/auth/authSlice";

const UserHistoryTable = () => {
  const [editedRow, setEditedRow] = useState({});
  const [AddRow, setAddRow] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [recyclingHistoryId, setRecyclingHistoryId] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const allRecyclingHistories = useSelector(
    (state) => state.recycle.allRecyclingHistories.data
  );

  // console.log(allRecyclingHistories);

  // const allRecycleLocations = useSelector(
  //   (state) => state.recycle.allRecycleLocations
  // );

  const allRecycleLocations = useSelector(
    (state) => state.recycle.allRecycleLocations
  );

  useEffect(() => {
    dispatch(getAllRecycleLocation(user.token));
    dispatch(getAllRecyclingHistories(user.token));
  }, [dispatch, user.token, openEditDialog, AddRow]);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [values, setValues] = useState({
    recyclingLocationId: "",
    recyclingMethod: "",
    quantity: "",
    wasteType: "",
  });

  const [valuesAdd, setValuesAdd] = useState({
    user_id: "",
    recyclingLocationId: "",
    recyclingMethod: "",
    quantity: "",
    wasteType: "",
  });

  const handleShowModal = () => {
    setVisible(true);
  };

  const handleInfoButtonPress = (row) => {
    setSelectedRow(row);
    console.log(row); // Add this console log to check the row data
    handleShowModal();
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

  const handleEdit = async (rowData) => {
    // await dispatch(getRecycleHistoryById({ id, token: user.token }));
    setEditedRow(rowData);
    setOpenEditDialog(true);
    setRecyclingHistoryId(rowData.id);
  };

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

  const onSubmit = async (valuesAdd) => {
    // const { recyclingLocationId, recyclingMethod, quantity, wasteType  } =
    //   values;
    //   const user_id = AddRow.user_id
    const newFormData = {
      recyclingLocationId: valuesAdd.recyclingLocationId,
      recyclingMethod: valuesAdd.recyclingMethod,
      quantity: calculateQuantity(valuesAdd.quantity, valuesAdd.wasteType),
      wasteType: valuesAdd.wasteType,
      user_id: valuesAdd.user_id,
    };

    console.log(newFormData);

    await dispatch(createRecyclingHistory({ newFormData, token: user.token }));
    dispatch(getAllRecyclingHistories(user.token));

    handleClose();
    Toast.show({
      type: "success",
      text1: "Recycling History has been created for the user",
    });
  };

  const onSubmitEdit = async (values) => {
    const newFormData = {
      recyclingHistoryId: recyclingHistoryId,
      recyclingLocationId: values.recyclingLocationId,
      recyclingMethod: values.recyclingMethod,
      quantity: calculateQuantity(values.quantity, values.wasteType),
      wasteType: values.wasteType,
    };

    console.log(newFormData);

    const id = editedRow.id;

    await dispatch(
      updateRecycleHistoryById({ id, newFormData, token: user.token })
    );
    dispatch(getAllRecyclingHistories(user.token));
    Toast.show({
      type: "success",
      text1: "Recycling History has been edited",
    });
    handleClose();
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this recycling history?")
    ) {
      await dispatch(deleteRecycleHistory({ id, token: user.token })).then(
        () => {
          dispatch(getAllRecyclingHistories(user.token));
          Toast.show({
            type: "error",
            text1: "Recycling History has been deleted",
          });
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button style={styles.createButton} onPress={handleClickOpen}>
          <Text style={styles.createButtonText}>Create</Text>
        </Button>
      </View>
      <View
        style={[
          styles.dataTable,
          { maxHeight: windowHeight - 200, elevation: 2 },
        ]}
      >
        <View style={[styles.header, styles.row]}>
          <Text style={[styles.headerText, styles.shortCell]}>Name</Text>
          <Text style={[styles.headerText, styles.longCell]}>Location</Text>
          <Text style={[styles.headerText, styles.longCell]}>Created At</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {allRecyclingHistories &&
            allRecyclingHistories
              .slice()
              .sort((a, b) => a.user.localeCompare(b.user)) // Sort the array by name
              .map((row, idx) => (
                <TouchableOpacity
                  key={`${row.user_id}_${idx}`}
                  style={[styles.row, idx % 2 === 0 && styles.rowEven]}
                  onPress={() => handleInfoButtonPress(row)}
                >
                  <Text style={[styles.text, styles.shortCell]}>
                    {row.user}
                  </Text>
                  <Text style={[styles.text, styles.longCell]}>
                    {row.recyclingLocation}
                  </Text>
                  <Text style={[styles.text, styles.longCell]}>
                    {new Date(row.updatedAt).toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
        </ScrollView>
      </View>

      {/* Render the Modal */}

      <Modal
        visible={visible}
        onDismiss={handleCloseModal}
        contentContainerStyle={styles.modalContainer}
      >
        <Text>Full Recycling History Information</Text>
        <Text>
          Recycling Location: {selectedRow && selectedRow.recyclingLocation}
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
        <Text>
          Updated at:{" "}
          {selectedRow && new Date(selectedRow.updatedAt).toLocaleString()}
        </Text>

        <View style={styles.modalButtonContainer}>
          <Button
            style={styles.modalButton}
            onPress={() => handleEdit(selectedRow && selectedRow)}
          >
            Edit
          </Button>
          <Button
            style={styles.modalButton}
            onPress={() => handleDelete(selectedRow && selectedRow.id)}
          >
            Delete
          </Button>
        </View>
      </Modal>

      {/* Render the Add Dialog */}

      {open && (
        <View style={styles.overlay}>
          {/* Render the Dialog here */}
          <Dialog visible={open} onClose={handleClose}>
            <Dialog.Title>Add New Recycling History </Dialog.Title>

            <Dialog.Content>
              <Text style={styles.label}>User</Text>
              <Picker
                selectedValue={valuesAdd.user_id}
                onValueChange={(itemValue) =>
                  setValuesAdd((prevState) => ({
                    ...prevState,
                    user_id: itemValue,
                  }))
                }
              >
                {Array.from(
                  new Set(allRecyclingHistories.map((data) => data.user_id))
                ).map((userId) => {
                  const userData = allRecyclingHistories.find(
                    (data) => data.user_id === userId
                  );
                  return (
                    <Picker.Item
                      key={userData.user_id}
                      label={userData.user}
                      value={userData.user_id}
                    />
                  );
                })}
              </Picker>
              <Text style={styles.label}>Recycling Location</Text>
              <Picker
                selectedValue={valuesAdd.recyclingLocationId}
                onValueChange={(itemValue) =>
                  setValuesAdd((prevState) => ({
                    ...prevState,
                    recyclingLocationId: itemValue,
                  }))
                }
              >
                {allRecycleLocations.data
                  .slice()
                  .sort((a, b) => a.locationName.localeCompare(b.locationName))
                  .map((data) => (
                    <Picker.Item
                      key={data._id}
                      label={data.locationName}
                      value={data._id}
                    />
                  ))}
              </Picker>
              <Text style={styles.label}>Recycling Method</Text>
              <Picker
                selectedValue={valuesAdd.recyclingMethod}
                onValueChange={(itemValue) =>
                  setValuesAdd((prevState) => ({
                    ...prevState,
                    recyclingMethod: itemValue,
                  }))
                }
              >
                <Picker.Item label="Curbside Recycling" value="curbside" />
                <Picker.Item label="Drop-off Recycling" value="drop-off" />
                <Picker.Item label="Composting" value="composting" />
                <Picker.Item
                  label="E-waste Recycling"
                  value="E-waste Recycling"
                />
              </Picker>
              <Text style={styles.label}>Waste Type</Text>
              <Picker
                selectedValue={valuesAdd.wasteType}
                onValueChange={(itemValue) =>
                  setValuesAdd((prevState) => ({
                    ...prevState,
                    wasteType: itemValue,
                  }))
                }
              >
                <Picker.Item label="Plastic" value="Plastic" />
                <Picker.Item label="Paper" value="Paper" />
                <Picker.Item label="Glass" value="Glass" />
                <Picker.Item label="Metal" value="Metal" />
                <Picker.Item label="Bottle" value="Bottle" />
                <Picker.Item label="Can" value="Can" />
              </Picker>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={valuesAdd.quantity}
                onChangeText={(text) =>
                  setValuesAdd((prevState) => ({
                    ...prevState,
                    quantity: text,
                  }))
                }
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleClose}>Cancel</Button>
              <Button onPress={() => onSubmit(valuesAdd)}>Create</Button>
            </Dialog.Actions>
          </Dialog>
        </View>
      )}

      {/* Render the Edit Dialog */}

      {openEditDialog && (
        <View style={styles.overlay}>
          {/* Render the Dialog here */}
          <Dialog visible={openEditDialog} onClose={handleClose}>
            <Dialog.Title>
              Edit Recycling History for User : {editedRow.user}
            </Dialog.Title>
            <Dialog.Content>
              <Text style={styles.label}>Recycling Location</Text>
              <Picker
                selectedValue={values.recyclingLocationId}
                onValueChange={(itemValue) =>
                  setValues((prevState) => ({
                    ...prevState,
                    recyclingLocationId: itemValue,
                  }))
                }
              >
                {allRecycleLocations.data
                  .slice()
                  .sort((a, b) => a.locationName.localeCompare(b.locationName))
                  .map((data) => (
                    <Picker.Item
                      key={data._id}
                      label={data.locationName}
                      value={data._id}
                    />
                  ))}
              </Picker>
              <Text style={styles.label}>Recycling Method</Text>
              <Picker
                selectedValue={values.recyclingMethod}
                onValueChange={(itemValue) =>
                  setValues((prevState) => ({
                    ...prevState,
                    recyclingMethod: itemValue,
                  }))
                }
              >
                <Picker.Item label="Curbside Recycling" value="curbside" />
                <Picker.Item label="Drop-off Recycling" value="drop-off" />
                <Picker.Item label="Composting" value="composting" />
                <Picker.Item
                  label="E-waste Recycling"
                  value="E-waste Recycling"
                />
              </Picker>
              <Text style={styles.label}>Waste Type</Text>
              <Picker
                selectedValue={values.wasteType}
                onValueChange={(itemValue) =>
                  setValues((prevState) => ({
                    ...prevState,
                    wasteType: itemValue,
                  }))
                }
              >
                <Picker.Item label="Plastic" value="Plastic" />
                <Picker.Item label="Paper" value="Paper" />
                <Picker.Item label="Glass" value="Glass" />
                <Picker.Item label="Metal" value="Metal" />
                <Picker.Item label="Bottle" value="Bottle" />
                <Picker.Item label="Can" value="Can" />
              </Picker>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={values.quantity}
                onChangeText={(text) =>
                  setValues({ ...values, quantity: text })
                }
              />
              {/* {setValues({ ...values, id: recyclingHistory._id})} */}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleClose}>Cancel</Button>
              <Button onPress={() => onSubmitEdit(values)}>Confirm</Button>
            </Dialog.Actions>
          </Dialog>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#f2f2f2",
  },
  dataTable: {
    // width: "90%",
    borderRadius: 10,
    elevation: 3,
    // backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    marginTop: 16,
    paddingBottom: 16,
  },
  header: {
    backgroundColor: "#4CAF50",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 48,
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  shortCell: {
    flex: 1,
  },
  longCell: {
    flex: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 48,
  },
  rowEven: {
    backgroundColor: "#F2F2F2",
  },
  text: {
    fontSize: 14,
  },
  createButton: {
    backgroundColor: "#4CAF50",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 70,
    borderRadius: 20,
  },
  modalContent: {
    flex: 1,
    justifyContent: "space-around",
  },
  modalButtonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  modalButton: {
    marginHorizontal: 5,
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
});

export default UserHistoryTable;
