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
import { ScrollView } from "react-native-web";

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

const Recycling = () => {
  //------------------------------------------------------------RECYCLING HISTORY--------------------------------------------------------------

  const [open, setOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recyclingHistoryId, setRecyclingHistoryId] = useState("")
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
            <View style={styles.headerContainer}>
              <View style={styles.buttonContainer}>
                <Button style={styles.createButton} onPress={handleClickOpen}>
                  Create new recycling history
                </Button>
              </View>
            </View>

            {/* Render the Add Dialog */}

            {open && (
              <View style={styles.overlay}>
                {/* Render the Dialog here */}
                <Dialog visible={open} onClose={handleClose}>
                  <Dialog.Title>Add New Recycling History</Dialog.Title>
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
                  <Dialog.Actions>
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
                <Dialog visible={openEditDialog} onClose={handleClose}>
                  <Dialog.Title>
                    Edit Recycling History for{" "}
                    {new Date(recyclingHistory.createdAt).toLocaleString()}
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
                    <Button onPress={() => onSubmitEdit(values)}>
                      Confirm
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </View>
            )}

            {/* DATA TABLE */}

            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={styles.longCell}>
                  Location
                </DataTable.Title>
                <DataTable.Title style={styles.longCell}>
                  Method
                </DataTable.Title>
                <DataTable.Title style={styles.shortCell}>Type</DataTable.Title>
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
                {selectedRow &&
                  new Date(selectedRow.createdAt).toLocaleString()}
              </Text>

              <View style={styles.modalButtonContainer}>
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
  const [pageLocation, setPageLocation] = useState(0);
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPagesLocation, setTotalPagesLocation] = useState(1);
  const [selectedRowLocation, setSelectedRowLocation] = useState(null);
  const [visibleLocation, setVisibleLocation] = useState(false);

  const numberOfItemsPerPageList = [2, 3, 4];

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

  const items = [
    {
      key: 1,
      name: "Page 1",
    },
    {
      key: 2,
      name: "Page 2",
    },
    {
      key: 3,
      name: "Page 3",
    },
  ];

  const from = pageLocation * numberOfItemsPerPage;
  const to = Math.min((pageLocation + 1) * numberOfItemsPerPage, items.length);

  // const allRecycleLocations = useSelector(
  //   (state) => state.recycle.allRecycleLocations.data
  // );

  const recycleLocation = useSelector(
    (state) => state.recycle.recycleLocationById
  );

  const initialValuesLocation = {
    locationName: "",
    street: "",
    city: "",
    postalCode: "",
    state: "",
    country: "",
    contactNumber: "",
    latitude: "",
    longitude: "",
  };

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

  useEffect(() => {
    setPageLocation(0);
  }, [numberOfItemsPerPage]);

  useEffect(() => {
    dispatch(getAllRecycleLocation(user.token));
    dispatch(
      getAllRecycleLocationByPageAndKeyword({
        token: user.token,
        pageLocation,
        search,
      })
    );
    setTotalPages(recycleLocations.pages);
  }, [dispatch, user.token, pageLocation, recycleLocations.pages, search]);

  const handleClickOpenLocation = () => {
    setOpenLocation(true);
  };

  const handleCloseLocation = () => {
    setOpenLocation(false);
    setOpenEditDialogLocation(false);
  };

  const handlePageChangeLocation = (page) => {
    setPageLocation(page);
    console.log("Page changed:", page);
  };

  const handleItemsPerPageChange = (value) => {
    setNumberOfItemsPerPage(value);
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

  const renderLocationTab = () => {
    return (
      <View style={styles.container}>
        <Provider>
          <Portal>
            {user.isAdmin ? (
              <View>
                <Button
                  style={styles.createButton}
                  onPress={handleClickOpenLocation}
                >
                  Create new Recycling Location
                </Button>
              </View>
            ) : (
              <Text></Text>
            )}
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={styles.longCell}>Name</DataTable.Title>
                <DataTable.Title style={styles.longCell}>
                  Address
                </DataTable.Title>
                <DataTable.Title style={styles.shortCell}>
                  Contact
                </DataTable.Title>
              </DataTable.Header>

              {recycleLocations.data &&
                recycleLocations.data.map((row) => (
                  <React.Fragment key={row._id}>
                    <DataTable.Row
                      onPress={() => handleInfoButtonPressLocation(row)}
                    >
                      <DataTable.Cell style={styles.longCell}>
                        {row.locationName}
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.longCell}>
                        `${row.address.street}, ${row.address.city}, $
                        {row.address.postalCode}, ${row.address.state}, $
                        {row.address.country}`
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.shortCell}>
                        {row.contactNumber}
                      </DataTable.Cell>
                    </DataTable.Row>
                  </React.Fragment>
                ))}

              <DataTable.Pagination
                page={pageLocation}
                numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
                onPageChange={handlePageChangeLocation}
                label={`${from + 1}-${to} of ${items.length}`}
                showFastPaginationControls
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={numberOfItemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </DataTable>

            {/* Render the Modal */}

            <Modal
              visible={visibleLocation}
              onDismiss={handleCloseModalLocation}
              contentContainerStyle={styles.modalContainer}
            >
              <View style={styles.modalContent}>
                <Text>Full Recycling Location Information</Text>
                <Text>Recycling Location: </Text>
                <Text>
                  {selectedRowLocation && selectedRowLocation.locationName}
                </Text>
                <Text>Address: </Text>
                <Text>
                  {selectedRowLocation && selectedRowLocation.address.street},{" "}
                  {selectedRowLocation && selectedRowLocation.address.city},
                  {selectedRowLocation &&
                    selectedRowLocation.address.postalCode}
                  , {selectedRowLocation && selectedRowLocation.address.state},
                  {selectedRowLocation && selectedRowLocation.address.country}
                </Text>
                <Text>
                  Contact Number:{" "}
                  {selectedRowLocation && selectedRowLocation.contactNumber}
                </Text>
                <Text>
                  Latitude:{" "}
                  {selectedRowLocation && selectedRowLocation.latitude}
                </Text>
                <Text>
                  Longitude:{" "}
                  {selectedRowLocation && selectedRowLocation.longitude}
                </Text>
              </View>

              <View>
                {user.isAdmin ? (
                  <View style={styles.modalLocationActions}>
                    <Button>Edit</Button>
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
                <Dialog.Title>Add New Recycling Location</Dialog.Title>
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
                        selectedValue={valuesLocation.state}
                        onValueChange={(itemValue) =>
                          setValuesLocation((prevState) => ({
                            ...prevState,
                            state: itemValue,
                          }))
                        }
                      >
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
                        selectedValue={valuesLocation.country}
                        onValueChange={(itemValue) =>
                          setValuesLocation((prevState) => ({
                            ...prevState,
                            country: itemValue,
                          }))
                        }
                      >
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
                <Dialog.Actions>
                  <Button onPress={handleCloseLocation}>Cancel</Button>
                  <Button onPress={() => onSubmitLocation(valuesLocation)}>
                    Create
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
    justifyContent: "space-between",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
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
});

export default Recycling;
