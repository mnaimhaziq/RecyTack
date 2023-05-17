import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  useTheme,
  Pagination,
  useMediaQuery,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import Header from "../components/Header";
import {
  getAllRecycleLocationByPageAndKeyword,
  getRecycleLocationById,
  updateRecycleLocationById,
  createRecycleLocation,
  deleteRecycleLocation,
} from "../features/recycle/recycleFunction/recycleLocationFunction";
import { Formik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const RecyclingLocation = () => {
  const [open, setOpen] = useState(false);
  const [malaysiaStates, setMalaysiaStates] = useState([ "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Melaka", "Negeri Sembilan", "Pahang", "Perak", "Perlis", "Pulau Pinang", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu"]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const recycleLocations = useSelector(
    (state) => state.recycle.recycleLocations
  );
  const recycleLocation = useSelector(
    (state) => state.recycle.recycleLocationById
  );

  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();

  useEffect(() => {
    if(!user.isAdmin){
      navigate("/dashboard")
    }
    dispatch(
      getAllRecycleLocationByPageAndKeyword({ token: user.token, page, search })
    );
    setTotalPages(recycleLocations.pages);
  }, [dispatch, user.token, page, recycleLocations.pages, search]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEditDialog(false);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleEdit = async (id) => {
    await dispatch(getRecycleLocationById({ id, token: user.token }));
    setOpenEditDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      await dispatch(deleteRecycleLocation({ id, token: user.token })).then(() => {
        dispatch(
          getAllRecycleLocationByPageAndKeyword({
            token: user.token,
            page,
            search,
          })
        );
      });
      toast.error("Recycling Location Has Been Deleted ");
    }
  };

  const initialValues = {
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

  const validationSchema = Yup.object().shape({
    locationName: Yup.string().required("This field is Required"),
    street: Yup.string().required("This field is Required"),
    city: Yup.string().required("This field is Required"),
    postalCode: Yup.string().required("This field is Required"),
    state: Yup.string().required("This field is Required"),
    country: Yup.string().required("This field is Required"),
    contactNumber: Yup.string().required("This field is Required"),
    latitude: Yup.number()
      .typeError("Must be a number")
      .required("This field is Required"),
    longitude: Yup.number()
      .typeError("Must be a number")
      .required("This field is Required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    const {
      locationName,
      contactNumber,
      latitude,
      longitude,
      street,
      city,
      postalCode,
      state,
      country,
    } = values;

    const newFormData = {
      locationName,
      contactNumber,
      latitude,
      longitude,
      address: {
        street: street,
        city: city,
        postalCode: postalCode,
        state: state,
        country: country,
      },
    };

    await dispatch(
      createRecycleLocation({ newFormData, token: user.token })
    ).then(() => {
      dispatch(
        getAllRecycleLocationByPageAndKeyword({
          token: user.token,
          page,
          search,
        })
      );
    });
    toast.success("New Recycling Location Created ");
    resetForm();
    setOpen(false);
  };

  const onSubmitEdit = async (values, { resetForm }) => {
    const {
      id,
      locationName,
      contactNumber,
      latitude,
      longitude,
      street,
      city,
      postalCode,
      state,
      country,
    } = values;

    const newFormData = {
      locationName,
      contactNumber,
      latitude,
      longitude,
      address: {
        street: street,
        city: city,
        postalCode: postalCode,
        state: state,
        country: country,
      },
    };

    try {
      await dispatch(
        updateRecycleLocationById({ id, newFormData, token: user.token })
      ).then(() => {
        dispatch(
          getAllRecycleLocationByPageAndKeyword({
            token: user.token,
            page,
            search,
          })
        );
      });
      toast.success("Recycling Location Has Been Edited ");
      resetForm();
      setOpenEditDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem " p="0 0 4rem 0">
      <ToastContainer theme="colored" />
      <Box
        display={isNonMobile ? "flex" : "block"}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          mb: "3rem",
        }}
      >
        <Header title="RECYCLING LOCATION" />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            id="search"
            label="Search By Location Name"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearchChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{
              ml: "1rem",
              padding: "0.5rem 1rem",
              color: "#000000",
              backgroundColor: theme.palette.primary.light,
              "&:hover": {
                color: theme.palette.neutral[1000],
              },
            }}
          >
            <Add /> Create New Recycling Location
          </Button>
        </Box>
      </Box>
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Recycling Collection Location</DialogTitle>

          <DialogContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ values, handleChange, handleSubmit, errors, touched }) => (
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Location Name"
                    id="locationName"
                    fullWidth
                    sx={{ my: 2 }}
                    name="locationName"
                    value={values.locationName}
                    onChange={handleChange}
                    error={errors.locationName && touched.locationName}
                    helperText={
                      touched.locationName && errors.locationName ? (
                        <span style={{ color: "red" }}>
                          {errors.locationName}
                        </span>
                      ) : null
                    }
                  />

                  <TextField
                    label="Street Address"
                    id="street"
                    fullWidth
                    sx={{ my: 2 }}
                    name="street"
                    value={values.street}
                    onChange={handleChange}
                    error={errors.street && touched.street}
                    helperText={
                      touched.street && errors.street ? (
                        <span style={{ color: "red" }}>{errors.street}</span>
                      ) : null
                    }
                  />
                  <TextField
                    label="City"
                    id="city"
                    fullWidth
                    sx={{ my: 2 }}
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    error={errors.city && touched.city}
                    helperText={
                      touched.city && errors.city ? (
                        <span style={{ color: "red" }}>{errors.city}</span>
                      ) : null
                    }
                  />
                  <TextField
                    label="Postal Code"
                    id="postalCode"
                    fullWidth
                    sx={{ my: 2 }}
                    name="postalCode"
                    value={values.postalCode}
                    onChange={handleChange}
                    error={errors.postalCode && touched.postalCode}
                    helperText={
                      touched.postalCode && errors.postalCode ? (
                        <span style={{ color: "red" }}>
                          {errors.postalCode}
                        </span>
                      ) : null
                    }
                  />
                  <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                    <Select
                      labelId="State"
                      label="State"
                      id="state"
                      name="state"
                      value={values.state}
                      onChange={handleChange}
                    >
                      { malaysiaStates.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                    </Select>
                    <InputLabel htmlFor="state">State</InputLabel>
                  </FormControl>

                  <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                    <Select
                      labelId="Country"
                      label="Country"
                      id="country"
                      name="country"
                      value={values.country}
                      onChange={handleChange}
                    >
                      <MenuItem value="Malaysia">Malaysia</MenuItem>
                    </Select>
                    <InputLabel htmlFor="country">Country</InputLabel>
                  </FormControl>

                  <TextField
                    label="Contact Number"
                    id="contactNumber"
                    fullWidth
                    sx={{ my: 2 }}
                    name="contactNumber"
                    value={values.contactNumber}
                    onChange={handleChange}
                    error={errors.contactNumber && touched.contactNumber}
                    helperText={
                      touched.contactNumber && errors.contactNumber ? (
                        <span style={{ color: "red" }}>
                          {errors.contactNumber}
                        </span>
                      ) : null
                    }
                  />
                  <TextField
                    label="Latitude"
                    id="Latitude"
                    fullWidth
                    sx={{ my: 2 }}
                    name="latitude"
                    value={values.latitude}
                    onChange={handleChange}
                    error={errors.latitude && touched.latitude}
                    helperText={
                      touched.latitude && errors.latitude ? (
                        <span style={{ color: "red" }}>{errors.latitude}</span>
                      ) : null
                    }
                  />

                  <TextField
                    label="Longitude"
                    id="longitude"
                    fullWidth
                    sx={{ my: 2 }}
                    name="longitude"
                    value={values.longitude}
                    onChange={handleChange}
                    error={errors.longitude && touched.longitude}
                    helperText={
                      touched.longitude && errors.longitude ? (
                        <span style={{ color: "red" }}>{errors.longitude}</span>
                      ) : null
                    }
                  />
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      sx={{
                        padding: "0.5rem 1rem",
                        color: theme.palette.neutral[1000],
                        backgroundColor: theme.palette.primary.light,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      sx={{
                        padding: "0.5rem 1rem",
                        color: theme.palette.neutral[1000],
                        backgroundColor: theme.palette.primary.light,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      Create
                    </Button>
                  </DialogActions>
                </form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead style={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell style={{ color: "#ffffff" }}>
                  LOCATION NAME
                </TableCell>
                <TableCell style={{ color: "#ffffff" }}>ADDRESS</TableCell>
                <TableCell style={{ color: "#ffffff" }}>
                  CONTACT NUMBER
                </TableCell>
                {/* <TableCell>Waste Types</TableCell> */}
                <TableCell style={{ color: "#ffffff" }}>LATITUDE</TableCell>
                <TableCell style={{ color: "#ffffff" }}>LONGITUDE</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recycleLocations.data &&
                recycleLocations.data.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.locationName}</TableCell>
                    <TableCell>{`${row.address.street}, ${row.address.city}, ${row.address.postalCode}, ${row.address.state}, ${row.address.country}`}</TableCell>
                    <TableCell>{row.contactNumber}</TableCell>
                    <TableCell>{row.latitude}</TableCell>
                    <TableCell>{row.longitude}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEdit(row._id)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(row._id)}
                      >
                        <Delete sx={{ color: "#e00a33" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            sx={{
              m: "1rem 0",
              "& .Mui-selected": { backgroundColor: "rgba(13,110,253,0.5)" },
            }}
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            siblingCount={1}
            showFirstButton
            showLastButton
          />
        </Box>
      </Paper>
      <Dialog open={openEditDialog} onClose={handleClose}>
        <DialogTitle>
          Edit Recycling Collection Location for {recycleLocation.locationName}
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              id: recycleLocation._id,
              locationName: recycleLocation.locationName,
              street: recycleLocation.address
                ? recycleLocation.address.street
                : "",
              city: recycleLocation.address ? recycleLocation.address.city : "",
              postalCode: recycleLocation.address
                ? recycleLocation.address.postalCode
                : "",
                state: recycleLocation.address
                ? recycleLocation.address.state
                : "",
              country: recycleLocation.address
                ? recycleLocation.address.country
                : "",
              contactNumber: recycleLocation.contactNumber,
              latitude: recycleLocation.latitude,
              longitude: recycleLocation.longitude,
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmitEdit}
          >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Location Name"
                  id="locationName"
                  fullWidth
                  sx={{ my: 2 }}
                  name="locationName"
                  value={values.locationName}
                  onChange={handleChange}
                  error={errors.locationName && touched.locationName}
                  helperText={
                    touched.locationName && errors.locationName ? (
                      <span style={{ color: "red" }}>
                        {errors.locationName}
                      </span>
                    ) : null
                  }
                />

                <TextField
                  label="Street Address"
                  id="street"
                  fullWidth
                  sx={{ my: 2 }}
                  name="street"
                  value={values.street}
                  onChange={handleChange}
                  error={errors.street && touched.street}
                  helperText={
                    touched.street && errors.street ? (
                      <span style={{ color: "red" }}>{errors.street}</span>
                    ) : null
                  }
                />
                <TextField
                  label="City"
                  id="city"
                  fullWidth
                  sx={{ my: 2 }}
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  error={errors.city && touched.city}
                  helperText={
                    touched.city && errors.city ? (
                      <span style={{ color: "red" }}>{errors.city}</span>
                    ) : null
                  }
                />
                <TextField
                  label="Postal Code"
                  id="postalCode"
                  fullWidth
                  sx={{ my: 2 }}
                  name="postalCode"
                  value={values.postalCode}
                  onChange={handleChange}
                  error={errors.postalCode && touched.postalCode}
                  helperText={
                    touched.postalCode && errors.postalCode ? (
                      <span style={{ color: "red" }}>{errors.postalCode}</span>
                    ) : null
                  }
                />
                  <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                    <Select
                      labelId="State"
                      label="State"
                      id="state"
                      name="state"
                      value={values.state}
                      onChange={handleChange}
                    >
                      { malaysiaStates.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                    </Select>
                    <InputLabel htmlFor="state">State</InputLabel>
                  </FormControl>

                  <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                    <Select
                      labelId="Country"
                      label="Country"
                      id="country"
                      name="country"
                      value={values.country}
                      onChange={handleChange}
                    >
                      <MenuItem value="Malaysia">Malaysia</MenuItem>
                    </Select>
                    <InputLabel htmlFor="country">Country</InputLabel>
                  </FormControl>
                <TextField
                  label="Contact Number"
                  id="contactNumber"
                  fullWidth
                  sx={{ my: 2 }}
                  name="contactNumber"
                  value={values.contactNumber}
                  onChange={handleChange}
                  error={errors.contactNumber && touched.contactNumber}
                  helperText={
                    touched.contactNumber && errors.contactNumber ? (
                      <span style={{ color: "red" }}>
                        {errors.contactNumber}
                      </span>
                    ) : null
                  }
                />
                <TextField
                  label="Latitude"
                  id="Latitude"
                  fullWidth
                  sx={{ my: 2 }}
                  name="latitude"
                  value={values.latitude}
                  onChange={handleChange}
                  error={errors.latitude && touched.latitude}
                  helperText={
                    touched.latitude && errors.latitude ? (
                      <span style={{ color: "red" }}>{errors.latitude}</span>
                    ) : null
                  }
                />

                <TextField
                  label="Longitude"
                  id="longitude"
                  fullWidth
                  sx={{ my: 2 }}
                  name="longitude"
                  value={values.longitude}
                  onChange={handleChange}
                  error={errors.longitude && touched.longitude}
                  helperText={
                    touched.longitude && errors.longitude ? (
                      <span style={{ color: "red" }}>{errors.longitude}</span>
                    ) : null
                  }
                />
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    sx={{
                      padding: "0.5rem 1rem",
                      color: theme.palette.neutral[1000],
                      backgroundColor: theme.palette.yellow.main,
                      "&:hover": {
                        color: theme.palette.neutral[10],
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    sx={{
                      padding: "0.5rem 1rem",
                      color: theme.palette.neutral[1000],
                      backgroundColor: theme.palette.yellow.main,
                      "&:hover": {
                        color: theme.palette.neutral[10],
                      },
                    }}
                  >
                    Save
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RecyclingLocation;
