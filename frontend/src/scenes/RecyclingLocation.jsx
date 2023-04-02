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
  PaginationItem
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Header from "../components/Header";
import {
  getAllRecycleLocation,
  getAllWasteTypes,
  deleteRecycleCollection,
  getRecycleLocationById,
  updateRecycleLocationById,
} from "../features/recycle/recycleSlice";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { createRecycleCollection, reset } from "../features/recycle/recycleSlice";

const RecyclingLocation = () => {
  const [open, setOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const [totalPages, setTotalPages] = useState(1);

  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const recycleLocations = useSelector((state) => state.recycle.recycleLocations);
  const recycleLocation = useSelector((state) => state.recycle.recycleLocationById);


  const dispatch = useDispatch();

  const theme = useTheme();

  useEffect(() => {
    dispatch(getAllRecycleLocation({token: user.token, page, search} ));
    dispatch(getAllWasteTypes(user.token));
    setTotalPages(recycleLocations.pages)
  }, [dispatch, user.token, page, recycleLocations.pages,search]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEditDialog(false)
  };

  const handlePageChange = (event, value) => {
   setPage(value)
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1)
  }
  
  

  const handleEdit = async (id) => {
    
    await dispatch(getRecycleLocationById({ id, token: user.token, search }));
    setOpenEditDialog(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      dispatch(deleteRecycleCollection({ id, token: user.token }));
      dispatch(getAllRecycleLocation({token: user.token, page, search} ));    }
  };

  const initialValues = {
    locationName: "",
    street: "",
    city: "",
    postalCode: "",
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
    country: Yup.string().required("This field is Required"),
    contactNumber: Yup.string().required("This field is Required"),
    latitude: Yup.number().typeError("Must be a number").required("This field is Required"),
    longitude: Yup.number().typeError("Must be a number").required("This field is Required"),
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
        country: country
      }
    };
    
    await dispatch(createRecycleCollection({newFormData, token: user.token}));
    dispatch(getAllRecycleLocation({token: user.token, page, search} ));
    resetForm();
    setOpen(false);
  };

  const onSubmitEdit = async (values, { setSubmitting, resetForm }) => {
    const {
      id,
      locationName,
      contactNumber,
      latitude,
      longitude,
      street,
      city,
      postalCode,
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
        country: country
      }
    };
  
    try {
      await dispatch(updateRecycleLocationById({ id, newFormData, token: user.token }));
      dispatch(getAllRecycleLocation({token: user.token, page, search} ));
      resetForm();
      setOpenEditDialog(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box m="1.5rem 2.5rem " p="0 0 4rem 0">
      <Header title="RECYCLING LOCATION" />
      
      <div>
        
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <Button
    sx={{ m: '1rem 0' }}
    variant="contained"
    color="primary"
    onClick={handleClickOpen}
  >
    Create New Recycling Location
  </Button>
  <TextField
    id="search"
    label="Search By Location Name"
    variant="outlined"
    size="small"
    value={search}
    onChange={handleSearchChange}
    sx={{ m: '0 0 1rem 0' }}
  />
</Box>
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
                    helperText={<span style={{color: 'red'}}>{errors.locationName}</span>}          
                 
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
                    helperText={<span style={{color: 'red'}}>{errors.street}</span>}          
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
                    helperText={<span style={{color: 'red'}}>{errors.city}</span>}          
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
                    helperText={<span style={{color: 'red'}}>{errors.postalCode}</span>}          
                  />
                  <TextField
                    label="Country"
                    id="country"
                    fullWidth
                    sx={{ my: 2 }}
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                    error={errors.country && touched.country}
                    helperText={<span style={{color: 'red'}}>{errors.country}</span>}          
                  />
                  <TextField
                    label="Contact Number"
                    id="contactNumber"
                    fullWidth
                    sx={{ my: 2 }}
                    name="contactNumber"
                    value={values.contactNumber}
                    onChange={handleChange}
                    error={errors.contactNumber && touched.contactNumber}
                    helperText={<span style={{color: 'red'}}>{errors.contactNumber}</span>}          
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
                    helperText={<span style={{color: 'red'}}>{errors.latitude}</span>}     
                             
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
                    helperText={<span style={{color: 'red'}}>{errors.longitude}</span>}          
                  />
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      sx={{
                        color: theme.palette.neutral[10],
                        backgroundColor: theme.palette.primary.main,
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      sx={{
                        color: theme.palette.neutral[10],
                        backgroundColor: theme.palette.primary.main,
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
      <Paper >
        <TableContainer>
          <Table>
          <TableHead style={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow  >
                <TableCell style={{ color: '#ffffff' }}>Location Name</TableCell>
                <TableCell style={{ color: '#ffffff' }}>Address</TableCell>
                <TableCell style={{ color: '#ffffff' }}>Contact Number</TableCell>
                {/* <TableCell>Waste Types</TableCell> */}
                <TableCell style={{ color: '#ffffff' }}>Latitude</TableCell>
                <TableCell style={{ color: '#ffffff' }}>Longitude</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recycleLocations.data && (recycleLocations.data.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.locationName}</TableCell>
                  <TableCell>{`${row.address.street}, ${row.address.city}, ${row.address.postalCode}, ${row.address.country}`}</TableCell>
                  <TableCell>{row.contactNumber}</TableCell>

                  {/* <TableCell>{row.acceptedWasteTypes.join(", ")}</TableCell> */}
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
                      
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Pagination
        sx={{m: "1rem 0"}}
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
          <DialogTitle>Edit Recycling Collection Location for {recycleLocation.locationName}</DialogTitle>
          <DialogContent>
          <Formik
              initialValues={{
                id: recycleLocation._id,
                locationName: recycleLocation.locationName,
                street: recycleLocation.address ? recycleLocation.address.street : '',
                city: recycleLocation.address ? recycleLocation.address.city : '',
                postalCode: recycleLocation.address ? recycleLocation.address.postalCode : '',
                country: recycleLocation.address ? recycleLocation.address.country : '',
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
                    helperText={<span style={{color: 'red'}}>{errors.locationName}</span>}          
                 
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
                    helperText={<span style={{color: 'red'}}>{errors.street}</span>}          
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
                    helperText={<span style={{color: 'red'}}>{errors.city}</span>}          
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
                    helperText={<span style={{color: 'red'}}>{errors.postalCode}</span>}          
                  />
                  <TextField
                    label="Country"
                    id="country"
                    fullWidth
                    sx={{ my: 2 }}
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                    error={errors.country && touched.country}
                    helperText={<span style={{color: 'red'}}>{errors.country}</span>}          
                  />
                  <TextField
                    label="Contact Number"
                    id="contactNumber"
                    fullWidth
                    sx={{ my: 2 }}
                    name="contactNumber"
                    value={values.contactNumber}
                    onChange={handleChange}
                    error={errors.contactNumber && touched.contactNumber}
                    helperText={<span style={{color: 'red'}}>{errors.contactNumber}</span>}          
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
                    helperText={<span style={{color: 'red'}}>{errors.latitude}</span>}     
                             
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
                    helperText={<span style={{color: 'red'}}>{errors.longitude}</span>}          
                  />
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      sx={{
                        color: theme.palette.neutral[10],
                        backgroundColor: theme.palette.primary.main,
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      sx={{
                        color: theme.palette.neutral[10],
                        backgroundColor: theme.palette.primary.main,
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
