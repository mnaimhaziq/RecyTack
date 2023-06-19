import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Picker,
  TextInput,
  TouchableOpacityComponent,
  TouchableWithoutFeedback,
  Linking,
  Alert,
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
import { TabView, TabBar } from "react-native-tab-view";
import { openMap, createOpenLink } from "react-native-open-maps";
import { Dimensions } from "react-native";
import { ScrollView } from "native-base";

import {
  getAllRecycleLocation,
  getRecycleHistoryByUserId,
  createRecyclingHistory,
  deleteRecycleHistory,
  getRecycleHistoryById,
  updateRecycleHistoryById,
  getRecycleHistoryByUserIdAndPage,
  getAllRecycleLocationByPageAndKeyword,
  getRecycleLocationById,
  updateRecycleLocationById,
  createRecycleLocation,
  deleteRecycleLocation,
} from "../features/recycle/recycleSlice";

import UserHistoryTable from "../components/UserHistoryTable";

const Recycling = () => {
  //------------------------------------------------------------RECYCLING HISTORY--------------------------------------------------------------

  const [open, setOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recyclingHistoryId, setRecyclingHistoryId] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [visible, setVisible] = useState(false);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "history", title: "History" },
    { key: "location", title: "Location" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "history":
        return renderHistoryTab();
      case "location":
        return renderLocationTab();
      default:
        return null;
    }
  };

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
    setRecyclingHistoryId(id);
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
    const newFormData = {
      recyclingLocationId: values.recyclingLocationId,
      recyclingMethod: values.recyclingMethod,
      quantity: calculateQuantity(values.quantity, values.wasteType),
      wasteType: values.wasteType,
    };
    console.log(newFormData);

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
    // resetForm();
    setOpen(false);
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
    Toast.show({
      type: "success",
      text1: "Recycling History has been edited",
    });
    setOpenEditDialog(false);
  };

  const [selectedValue, setSelectedValue] = useState("");

  const renderHistoryTab = () => {
    // Existing code here
    return (
      <View style={styles.container}>
        {/* Existing code for history tab */}
        <Provider>
          <Portal>
            {/* <View style={styles.buttonContainer}>
              <Button style={styles.createButton} onPress={handleClickOpen}>
                <Text style={styles.createButtonText}>Create</Text>
              </Button>
            </View> */}

            {/* DATA TABLE */}

            {user.isAdmin ? (
              <UserHistoryTable />
            ) : (
              <>
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
                  <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={[styles.header, styles.row]}>
                      <Text style={[styles.headerText, styles.longCell]}>
                        Location
                      </Text>
                      <Text style={[styles.headerText, styles.longCell]}>
                        Method
                      </Text>
                      <Text style={[styles.headerText, styles.longCell]}>
                        CreatedAt
                      </Text>
                    </View>
                    {recyclingHistories.data &&
                      recyclingHistories.data.map((row, idx) => (
                        <TouchableOpacity
                          key={row._id}
                          style={[styles.row, idx % 2 === 0 && styles.rowEven]}
                          onPress={() => handleInfoButtonPress(row)}
                        >
                          <Text style={[styles.text, styles.longCell]}>
                            {row.recyclingLocation
                              ? row.recyclingLocation.locationName
                              : "null"}
                          </Text>
                          <Text style={[styles.text, styles.longCell]}>
                            {row.recyclingMethod}
                          </Text>
                          <Text style={[styles.text, styles.longCell]}>
                            {new Date(row.createdAt).toLocaleString()}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              </>
            )}

            {/* Render the Add Dialog */}

            {open && (
              <View style={styles.overlay}>
                {/* Render the Dialog here */}
                <Dialog visible={open} onDismiss={handleClose}>
                  <Dialog.Title style={styles.dialogTitle}>
                    Add New Recycling History
                  </Dialog.Title>
                  <Dialog.Content>
                    <Text style={styles.label}>Recycling Location</Text>
                    <Picker
                      style={styles.picker}
                      selectedValue={values.recyclingLocationId}
                      onValueChange={(itemValue) =>
                        setValues((prevState) => ({
                          ...prevState,
                          recyclingLocationId: itemValue,
                        }))
                      }
                    >
                      <Picker.Item label="Select Location" value="" />
                      {allRecycleLocations.data
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
                    <Text style={styles.label}>Recycling Method</Text>
                    <Picker
                      style={styles.picker}
                      selectedValue={values.recyclingMethod}
                      onValueChange={(itemValue) =>
                        setValues((prevState) => ({
                          ...prevState,
                          recyclingMethod: itemValue,
                        }))
                      }
                    >
                      <Picker.Item label="Select Method" value="" />
                      <Picker.Item
                        label="Curbside Recycling"
                        value="curbside"
                      />
                      <Picker.Item
                        label="Drop-off Recycling"
                        value="drop-off"
                      />
                      <Picker.Item label="Composting" value="composting" />
                      <Picker.Item
                        label="E-waste Recycling"
                        value="E-waste Recycling"
                      />
                    </Picker>
                    <Text style={styles.label}>Waste Type</Text>
                    <Picker
                      style={styles.picker}
                      selectedValue={values.wasteType}
                      onValueChange={(itemValue) =>
                        setValues((prevState) => ({
                          ...prevState,
                          wasteType: itemValue,
                        }))
                      }
                    >
                      <Picker.Item label="Select Waste Type" value="" />
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
                  </Dialog.Content>
                  <Dialog.Actions style={styles.dialogActions}>
                    <Button onPress={handleClose}>Cancel</Button>
                    <Button onPress={() => onSubmit(values)}>Create</Button>
                  </Dialog.Actions>
                </Dialog>
              </View>
            )}

            {/* Render the Edit Dialog */}

            {openEditDialog && (
              <View style={styles.overlay}>
                {/* Render the Dialog here */}
                <Dialog visible={openEditDialog} onDismiss={handleClose}>
                  <Dialog.Title style={styles.dialogTitle}>
                    Edit Recycling History for{" "}
                    {new Date(recyclingHistory.createdAt).toLocaleString()}
                  </Dialog.Title>
                  <Dialog.Content>
                    <Text style={styles.label}>Recycling Location</Text>
                    <Picker
                      style={styles.picker}
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
                    <Text style={styles.label}>Recycling Method</Text>
                    <Picker
                      style={styles.picker}
                      selectedValue={values.recyclingMethod}
                      onValueChange={(itemValue) =>
                        setValues((prevState) => ({
                          ...prevState,
                          recyclingMethod: itemValue,
                        }))
                      }
                    >
                      <Picker.Item
                        label="Curbside Recycling"
                        value="curbside"
                      />
                      <Picker.Item
                        label="Drop-off Recycling"
                        value="drop-off"
                      />
                      <Picker.Item label="Composting" value="composting" />
                      <Picker.Item
                        label="E-waste Recycling"
                        value="E-waste Recycling"
                      />
                    </Picker>
                    <Text style={styles.label}>Waste Type</Text>
                    <Picker
                      style={styles.picker}
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
                  </Dialog.Content>
                  <Dialog.Actions style={styles.dialogActions}>
                    <Button onPress={handleClose}>Cancel</Button>
                    <Button onPress={() => onSubmitEdit(values)}>
                      Confirm
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </View>
            )}

            {/* Render the Modal */}

            <Modal
              visible={visible}
              onDismiss={handleCloseModal}
              contentContainerStyle={styles.modalContainer}
            >
              <Text style={styles.mainTitle}>
                Full Recycling History Information
              </Text>
              <View style={styles.infoContainer}>
                <Text style={styles.title}>Recycling Location: </Text>
                <Text style={styles.info}>
                  {selectedRow && selectedRow.recyclingLocation.locationName}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.title}>Recycling Method:</Text>
                <Text style={styles.info}>
                  {selectedRow && selectedRow.recyclingMethod}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.title}>Recycling Waste Type:</Text>
                <Text style={styles.info}>
                  {selectedRow && selectedRow.wasteType}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.title}>Quantity:</Text>
                <Text style={styles.info}>
                  {selectedRow && selectedRow.quantity}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.title}>Created at:</Text>
                <Text style={styles.info}>
                  {selectedRow &&
                    new Date(selectedRow.createdAt).toLocaleString()}
                </Text>
              </View>

              <View style={styles.modalLocationActions}>
                <Button
                  style={styles.modalButton}
                  onPress={() => handleEdit(selectedRow && selectedRow._id)}
                >
                  Edit
                </Button>
                <Button
                  style={styles.modalButton}
                  onPress={() => handleDelete(selectedRow && selectedRow._id)}
                >
                  Delete
                </Button>
              </View>
            </Modal>
          </Portal>
        </Provider>
      </View>
    );
  };

  //------------------------------------------------------------RECYCLING LOCATION--------------------------------------------------------------

  const [openLocation, setOpenLocation] = useState(false);
  const [openEditDialogLocation, setOpenEditDialogLocation] = useState(false);
  const [pageLocation, setPageLocation] = useState(1);
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPagesLocation, setTotalPagesLocation] = useState(1);
  const [selectedRowLocation, setSelectedRowLocation] = useState(null);
  const [visibleLocation, setVisibleLocation] = useState(false);
  const [recyclingLocationId, setRecyclingLocationId] = useState("");

  const [malaysiaStates, setMalaysiaStates] = useState([
    "Johor",
    "Kedah",
    "Kelantan",
    "Kuala Lumpur",
    "Labuan",
    "Melaka",
    "Negeri Sembilan",
    "Pahang",
    "Perak",
    "Perlis",
    "Pulau Pinang",
    "Putrajaya",
    "Sabah",
    "Sarawak",
    "Selangor",
    "Terengganu",
  ]);

  // const items = [
  //   {
  //     key: 1,
  //     name: "Page 1",
  //   },
  //   {
  //     key: 2,
  //     name: "Page 2",
  //   },
  //   {
  //     key: 3,
  //     name: "Page 3",
  //   },
  // ];

  // const from = pageLocation * numberOfItemsPerPage;
  // const to = Math.min((pageLocation + 1) * numberOfItemsPerPage, items.length);

  const recycleLocation = useSelector(
    (state) => state.recycle.recycleLocationById
  );

  const allRecycleLocations = useSelector(
    (state) => state.recycle.allRecycleLocations
  );

  // const recycleLocations = useSelector(
  //   (state) => state.recycle.recycleLocations
  // );

  const [valuesLocation, setValuesLocation] = useState({
    locationName: "",
    street: "",
    city: "",
    postalCode: "",
    state: "",
    country: "Malaysia",
    contactNumber: "",
    latitude: "",
    longitude: "",
  });

  // useEffect(() => {
  //   setPageLocation(0);
  // }, [numberOfItemsPerPage]);

  useEffect(() => {
    dispatch(getAllRecycleLocation(user.token));
    dispatch(
      getAllRecycleLocationByPageAndKeyword({
        token: user.token,
        pageLocation,
        search,
      })
    );
    setTotalPagesLocation(recycleLocations.pages);
  }, [dispatch, user.token, pageLocation, recycleLocations.pages, search]);

  const handleClickOpenLocation = () => {
    setOpenLocation(true);
  };

  const handleCloseLocation = () => {
    setOpenLocation(false);
    setOpenEditDialogLocation(false);
  };

  const handlePageChangeLocation = (value) => {
    setPageLocation(value);
    console.log("Page changed:", value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPageLocation(1);
  };

  const handleShowModalLocation = () => {
    setVisibleLocation(true);
  };

  const handleCloseModalLocation = () => {
    setVisibleLocation(false);
  };

  const handleInfoButtonPressLocation = (row) => {
    setSelectedRowLocation(row);
    console.log(row); // Add this console log to check the row data
    handleShowModalLocation();
  };

  const openMap = (latitude, longitude) => {
    const location = `${latitude},${longitude}`;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${location}`;
    Linking.openURL(mapUrl);
  };

  const onSubmitLocation = async (valuesLocation) => {
    const newFormData = {
      locationName: valuesLocation.locationName,
      contactNumber: valuesLocation.contactNumber,
      latitude: valuesLocation.latitude,
      longitude: valuesLocation.longitude,
      address: {
        street: valuesLocation.street,
        city: valuesLocation.city,
        postalCode: valuesLocation.postalCode,
        state: valuesLocation.state,
        country: valuesLocation.country,
      },
    };

    console.log(newFormData);

    await dispatch(createRecycleLocation({ newFormData, token: user.token }))
      .then(() => {
        dispatch(
          getAllRecycleLocationByPageAndKeyword({
            token: user.token,
            page,
            search,
          })
        );
      })
      .then(() => {
        dispatch(getAllRecycleLocation(user.token));
      });
    Toast.show({
      type: "success",
      text1: "New Recycling Location has been created",
    });
    setOpenLocation(false);
  };

  const handleDeleteLocation = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      await dispatch(deleteRecycleLocation({ id, token: user.token }))
        .then(() => {
          dispatch(
            getAllRecycleLocationByPageAndKeyword({
              token: user.token,
              page,
              search,
            })
          );
        })
        .then(() => {
          dispatch(getAllRecycleLocation(user.token));
        });
      Toast.show({
        type: "success",
        text1: "Recycling Location has been deleted",
      });
      setVisibleLocation(false);
    }
  };

  const handleEditLocation = async (id) => {
    await dispatch(getRecycleLocationById({ id, token: user.token }));
    setOpenEditDialogLocation(true);
    setRecyclingLocationId(id);
  };

  const onSubmitEditLocation = async (valuesLocation) => {
    const newFormData = {
      id: recyclingLocationId,
      locationName: valuesLocation.locationName,
      contactNumber: valuesLocation.contactNumber,
      latitude: valuesLocation.latitude,
      longitude: valuesLocation.longitude,
      address: {
        street: valuesLocation.street,
        city: valuesLocation.city,
        postalCode: valuesLocation.postalCode,
        state: valuesLocation.state,
        country: valuesLocation.country,
      },
    };

    const id = recycleLocation._id;

    console.log(newFormData);

    try {
      await dispatch(
        updateRecycleLocationById({ id, newFormData, token: user.token })
      )
        .then(() => {
          dispatch(
            getAllRecycleLocationByPageAndKeyword({
              token: user.token,
              page,
              search,
            })
          );
        })
        .then(() => {
          dispatch(getAllRecycleLocation(user.token));
        });
      Toast.show({
        type: "success",
        text1: "Recycling Location has been edited",
      });
      handleCloseLocation();
    } catch (error) {
      console.error(error);
    }
  };

  const windowHeight = Dimensions.get("window").height;

  const renderLocationTab = () => {
    return (
      <View style={styles.container}>
        <Provider>
          <Portal>
            {user.isAdmin ? (
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.createButton}
                  onPress={handleClickOpenLocation}
                >
                  <Text style={styles.createButtonText}>Add</Text>
                </Button>
              </View>
            ) : (
              <Text></Text>
            )}
            <View
              style={[
                styles.dataTable,
                { maxHeight: windowHeight - 200, elevation: 2 },
              ]}
            >
              <View style={[styles.header, styles.row]}>
                <Text style={[styles.headerText, styles.longCell]}>Name</Text>
                <Text style={[styles.headerText, styles.longCell]}>
                  Address
                </Text>
                <Text style={[styles.headerText, styles.shortCell]}>
                  Contact
                </Text>
              </View>

              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {allRecycleLocations.data &&
                  allRecycleLocations.data.map((row) => (
                    <TouchableOpacity
                      key={row._id}
                      style={[styles.row, styles.rowEven]}
                      onPress={() => handleInfoButtonPressLocation(row)}
                    >
                      <Text style={[styles.text, styles.longCell]}>
                        {row.locationName}
                      </Text>
                      <Text
                        style={[styles.text, styles.longCell]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {`${row.address.street}, ${row.address.city}, ${row.address.postalCode}, ${row.address.state}, ${row.address.country}`}
                      </Text>
                      <Text
                        style={[styles.text, styles.shortCell]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {row.contactNumber}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>

            {/* Render the Modal */}

            <Modal
              visible={visibleLocation}
              onDismiss={handleCloseModalLocation}
              contentContainerStyle={styles.modalContainer}
            >
              <View style={styles.modalContent}>
                <Text style={styles.mainTitle}>
                  Full Recycling Location Information
                </Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.title}>Recycling Location:</Text>
                  <Text style={styles.info}>
                    {selectedRowLocation && selectedRowLocation.locationName}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.title}>Address:</Text>
                  <Text style={styles.info}>
                    {selectedRowLocation && selectedRowLocation.address.street},{" "}
                    {selectedRowLocation && selectedRowLocation.address.city},{" "}
                    {selectedRowLocation &&
                      selectedRowLocation.address.postalCode}
                    , {selectedRowLocation && selectedRowLocation.address.state}
                    ,{" "}
                    {selectedRowLocation && selectedRowLocation.address.country}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.title}>Contact Number:</Text>
                  <Text style={styles.info}>
                    {selectedRowLocation && selectedRowLocation.contactNumber}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.title}>Latitude:</Text>
                  <Text style={styles.info}>
                    {selectedRowLocation && selectedRowLocation.latitude}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.title}>Longitude:</Text>
                  <Text style={styles.info}>
                    {selectedRowLocation && selectedRowLocation.longitude}
                  </Text>
                </View>
              </View>

              <View>
                {user.isAdmin ? (
                  <View style={styles.modalLocationActions}>
                    <Button
                      onPress={() =>
                        handleEditLocation(
                          selectedRowLocation && selectedRowLocation._id
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      onPress={() =>
                        handleDeleteLocation(
                          selectedRowLocation && selectedRowLocation._id
                        )
                      }
                    >
                      Delete
                    </Button>
                  </View>
                ) : (
                  <View style={styles.modalLocationActions}>
                    <Button
                      onPress={() =>
                        openMap(
                          selectedRowLocation?.latitude,
                          selectedRowLocation?.longitude
                        )
                      }
                    >
                      Open in Maps
                    </Button>
                  </View>
                )}
              </View>
            </Modal>

            {/* Add Location Dialog */}

            {openLocation && (
              <Dialog
                visible={openLocation}
                onClose={handleCloseLocation}
                style={styles.dialog}
              >
                <Dialog.Title style={styles.dialogTitle}>
                  Add New Recycling Location
                </Dialog.Title>
                <Dialog.ScrollArea>
                  <ScrollView>
                    <Dialog.Content>
                      <Text style={styles.label}>Recycling Location Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Location Name"
                        value={valuesLocation.locationName}
                        onChangeText={(text) =>
                          setValuesLocation({
                            ...valuesLocation,
                            locationName: text,
                          })
                        }
                      />
                      <Text style={styles.label}>Street Address</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Street Address"
                        value={valuesLocation.street}
                        onChangeText={(text) =>
                          setValuesLocation({
                            ...valuesLocation,
                            street: text,
                          })
                        }
                      />
                      <Text style={styles.label}>City</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter City"
                        value={valuesLocation.city}
                        onChangeText={(text) =>
                          setValuesLocation({ ...valuesLocation, city: text })
                        }
                      />
                      <Text style={styles.label}>Postal Code</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Postal Code"
                        value={valuesLocation.postalCode}
                        onChangeText={(text) =>
                          setValuesLocation({
                            ...valuesLocation,
                            postalCode: text,
                          })
                        }
                      />
                      <Text style={styles.label}>State</Text>
                      <Picker
                        style={styles.picker}
                        selectedValue={valuesLocation.state}
                        onValueChange={(itemValue) =>
                          setValuesLocation((prevState) => ({
                            ...prevState,
                            state: itemValue,
                          }))
                        }
                      >
                        <Picker.Item label="Select State" value="" />
                        {malaysiaStates.map((state) => (
                          <Picker.Item
                            key={state}
                            value={state}
                            label={state}
                            color="#000000"
                          >
                            {state}
                          </Picker.Item>
                        ))}
                      </Picker>
                      <Text style={styles.label}>Country</Text>
                      <Picker
                        style={styles.picker}
                        selectedValue={valuesLocation.country}
                        onValueChange={(itemValue) =>
                          setValuesLocation((prevState) => ({
                            ...prevState,
                            country: itemValue,
                          }))
                        }
                      >
                        <Picker.Item label="Select Country" value="" />
                        <Picker.Item label="Malaysia" value="Malaysia" />
                      </Picker>
                      <Text style={styles.label}>Contact Number</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Contact Number"
                        value={valuesLocation.contactNumber}
                        onChangeText={(text) =>
                          setValuesLocation({
                            ...valuesLocation,
                            contactNumber: text,
                          })
                        }
                      />
                      <Text style={styles.label}>Latitude</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Latitude"
                        value={valuesLocation.latitude}
                        onChangeText={(text) =>
                          setValuesLocation({
                            ...valuesLocation,
                            latitude: text,
                          })
                        }
                      />
                      <Text style={styles.label}>Longitude</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Longitude"
                        value={valuesLocation.longitude}
                        onChangeText={(text) =>
                          setValuesLocation({
                            ...valuesLocation,
                            longitude: text,
                          })
                        }
                      />
                    </Dialog.Content>
                  </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions style={styles.dialogActions}>
                  <Button onPress={handleCloseLocation}>Cancel</Button>
                  <Button onPress={() => onSubmitLocation(valuesLocation)}>
                    Create
                  </Button>
                </Dialog.Actions>
              </Dialog>
            )}

            {/* Edit Location Dialog */}

            {openEditDialogLocation && (
              <Dialog
                visible={openEditDialogLocation}
                onClose={handleCloseLocation}
                style={styles.dialog}
              >
                <Dialog.Title style={styles.dialogTitle}>
                  Edit the Recycling Locations
                </Dialog.Title>
                <Dialog.ScrollArea>
                  <ScrollView>
                    <Dialog.Content>
                      <Text style={styles.label}>Recycling Location Name</Text>
                      <TextInput
                        style={styles.input}
                        value={valuesLocation.locationName}
                        onChangeText={(text) =>
                          setValuesLocation({
                            ...valuesLocation,
                            locationName: text,
                          })
                        }
                      />
                      <Text style={styles.label}>Street Address</Text>
                      <TextInput
                        style={styles.input}
                        value={valuesLocation.street}
                        onChangeText={(text) =>
                          setValuesLocation({
                            ...valuesLocation,
                            street: text,
                          })
                        }
                      />
                      <Text style={styles.label}>City</Text>
                      <TextInput
                        style={styles.input}
                        value={valuesLocation.city}
                        onChangeText={(text) =>
                          setValuesLocation({ ...valuesLocation, city: text })
                        }
                      />
                      <Text style={styles.label}>Postal Code</Text>
                      <TextInput
                        style={styles.input}
                        value={valuesLocation.postalCode}
                        onChangeText={(text) =>
                          setValuesLocation({
                            ...valuesLocation,
                            postalCode: text,
                          })
                        }
                      />
                      <Text style={styles.label}>State</Text>
                      <Picker
                        style={styles.picker}
                        selectedValue={valuesLocation.state}
                        onValueChange={(itemValue) =>
                          setValuesLocation((prevState) => ({
                            ...prevState,
                            state: itemValue,
                          }))
                        }
                      >
                        <Picker.Item label="Select State" value="" />
                        {malaysiaStates.map((state) => (
                          <Picker.Item
                            key={state}
                            value={state}
                            label={state}
                            color="#000000"
                          >
                            {state}
                          </Picker.Item>
                        ))}
                      </Picker>
                      <Text style={styles.label}>Country</Text>
                      <Picker
                        style={styles.picker}
                        selectedValue={valuesLocation.country}
                        onValueChange={(itemValue) =>
                          setValuesLocation((prevState) => ({
                            ...prevState,
                            country: itemValue,
                          }))
                        }
                      >
                        <Picker.Item label="Select Country" value="" />
                        <Picker.Item label="Malaysia" value="Malaysia" />
                      </Picker>
                      <Text style={styles.label}>Contact Number</Text>
                      <TextInput
                        style={styles.input}
                        value={valuesLocation.contactNumber}
                        onChangeText={(text) =>
                          setValuesLocation({
                            ...valuesLocation,
                            contactNumber: text,
                          })
                        }
                      />
                      <Text style={styles.label}>Latitude</Text>
                      <TextInput
                        style={styles.input}
                        value={valuesLocation.latitude}
                        onChangeText={(text) =>
                          setValuesLocation({
                            ...valuesLocation,
                            latitude: text,
                          })
                        }
                      />
                      <Text style={styles.label}>Longitude</Text>
                      <TextInput
                        style={styles.input}
                        value={valuesLocation.longitude}
                        onChangeText={(text) =>
                          setValuesLocation({
                            ...valuesLocation,
                            longitude: text,
                          })
                        }
                      />
                    </Dialog.Content>
                  </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions style={styles.dialogActions}>
                  <Button onPress={handleCloseLocation}>Cancel</Button>
                  <Button onPress={() => onSubmitEditLocation(valuesLocation)}>
                    Save
                  </Button>
                </Dialog.Actions>
              </Dialog>
            )}
          </Portal>
        </Provider>
      </View>
    );
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
      <FooterList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  tableContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 4,
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
    borderRadius: 20,
  },

  modalContent: {
    flex: 1,
    justifyContent: "space-around",
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
  // headerText: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   marginLeft: 10,
  // },
  buttonContainer: {
    marginTop: 16,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  createButton: {
    color: "white",
    alignItems: "flex-end",
    marginTop: 5,
  },
  createButtonText: {
    color: "white",
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
    justifyContent: "flex-end",
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  picker: {
    height: 40,
    marginBottom: 16,
    backgroundColor: "#F5F5F5",
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
  tabBar: {
    backgroundColor: "white",
    elevation: 0,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  tabIndicator: {
    backgroundColor: "green",
  },
  modalLocationActions: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 20,
  },
  dialog: {
    height: 550, // Specify the desired height
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
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 48,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },
  text: {
    fontSize: 14,
  },

  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
  },
  modalContent: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  info: {
    fontSize: 16,
  },
  infoText: {
    marginBottom: 8,
  },
  modalLocationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default Recycling;
