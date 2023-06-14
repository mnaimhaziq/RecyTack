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
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  useMediaQuery,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import Header from "../components/Header";
import {
  createRecyclingHistory,
  deleteRecycleHistory,
  getRecycleHistoryById,
  updateRecycleHistoryById,
  getRecycleHistoryByUserIdAndPage,
  getAllRecyclingHistories,
} from "../features/recycle/recycleFunction/recyclingHistoryFunction";
import { getAllRecycleLocation } from "../features/recycle/recycleFunction/recycleLocationFunction";
import { getAllUsers } from "../features/auth/authSlice";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { ToastContainer, toast } from "react-toastify";
import AggregatedTable from "../components/AggregatedTable";
import Swal from "sweetalert2";

const RecyclingHistory = () => {
  const [open, setOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const allRecycleLocations = useSelector(
    (state) => state.recycle.allRecycleLocations
  );
  const AllUsers = useSelector((state) => state.auth.AllUsers);
  const recyclingHistories = useSelector(
    (state) => state.recycle.recyclingHistoriesTop8
  );
  const recyclingHistory = useSelector(
    (state) => state.recycle.recycleHistoryById
  );

  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width: 942px)");
  const theme = useTheme();

  useEffect(() => {
    dispatch(getAllRecycleLocation( user.token));
    dispatch(getAllUsers(user.token));
    dispatch(
      getRecycleHistoryByUserIdAndPage({
        id: user._id,
        page,
        token: user.token,
      })
    );
    setTotalPages(recyclingHistories.pages);
  }, [dispatch, user.token, page, user._id, recyclingHistories.pages]);

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

  const handleEdit = async (id) => {
    await dispatch(getRecycleHistoryById({ id, token: user.token }));
    setOpenEditDialog(true);
  };

  const handleDelete = async (id) => {
    await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
         dispatch(deleteRecycleHistory({ id, token: user.token })).then(
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
        toast.error("Recycling History Has Been Deleted ");
        }});
      };
  

  const initialValues = {
    user_id: user.isAdmin ? "" : user._id,
    recyclingLocationId: "",
    recyclingMethod: "",
    quantity: "",
    wasteType: "",
  };

  const validationSchema = Yup.object().shape({
    user_id: Yup.string().required("This field is Required"),
    recyclingLocationId: Yup.string().required("This field is Required"),
    recyclingMethod: Yup.string().required("This field is Required"),
    quantity: Yup.number()
      .typeError("Must be a number")
      .required("This field is Required"),
  });

  const EditvalidationSchema = Yup.object().shape({
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

  const onSubmit = async (values, { resetForm }) => {
    setIsButtonDisabled(true);
    const { user_id, recyclingLocationId, recyclingMethod, quantity, wasteType } =
      values;

    const newFormData = {
      user_id,
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
    }).then(() => {
      if(user.isAdmin){
        dispatch(getAllRecyclingHistories(user.token));
      }
      setOpen(false);
      setIsButtonDisabled(false);
      toast.success("New Recycling History Created ");
      resetForm();
    });

   
    
  };

  const onSubmitEdit = async (values, { resetForm }) => {
    setIsButtonDisabled(true);
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
    ).then(() => {
      dispatch(
        getRecycleHistoryByUserIdAndPage({
          id: user._id,
          page,
          token: user.token,
        })
      );
    }).then(() => {
      setOpenEditDialog(false);  
      setIsButtonDisabled(false);
      toast.success("Recycling History Has Been Edited ");
      resetForm();
    });
   
    
  };

  return (
    <Box m="1.5rem 2.5rem">
      <ToastContainer theme="colored" />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "3rem",
        }}
      >
        <Header title="RECYCLING HISTORY" />

        <Box sx={{ display: "flex", alignItems: "center" }}>
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
            <Add /> {isNonMobile ? "Create New Recycling History" : "create"}
          </Button>
        </Box>
      </Box>

     <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Recycling History</DialogTitle>

          <DialogContent
            sx={{
              width: isNonMobile ? 500 : null,
              maxWidth: isNonMobile ? null : 480,
            }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ values, handleChange, handleSubmit, errors, touched }) => (
                <Form onSubmit={handleSubmit}>
                  {user.isAdmin && <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                    <Select
                      labelId="user"
                      label="user"
                      id="user"
                      name="user_id"
                      value={values.user_id}
                      onChange={handleChange}
                    >
                      {AllUsers.data
                        .slice()
                        .sort((a, b) =>
                          a.name.localeCompare(b.name)
                        ) // Sort the options alphabetically
                        .map((data) => (
                          <MenuItem key={data._id} value={data._id}>
                            {data.name}
                          </MenuItem>
                        ))}
                    </Select>
                    <InputLabel htmlFor="user">
                      User
                    </InputLabel>
                  </FormControl>}
                  <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                    <Select
                      labelId="locationName"
                      label="Recycling Location"
                      id="locationName"
                      name="recyclingLocationId"
                      value={values.recyclingLocationId}
                      onChange={handleChange}
                    >
                      {allRecycleLocations.data
                        .slice()
                        .sort((a, b) =>
                          a.locationName.localeCompare(b.locationName)
                        ) // Sort the options alphabetically
                        .map((data) => (
                          <MenuItem key={data._id} value={data._id}>
                            {data.locationName}
                          </MenuItem>
                        ))}
                    </Select>
                    <InputLabel htmlFor="locationName">
                      Recycling Location
                    </InputLabel>
                  </FormControl>

                  <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                    <Select
                      labelId="recyclingMethod"
                      label="Recycling Method"
                      id="recyclingMethod"
                      name="recyclingMethod"
                      value={values.recyclingMethod}
                      onChange={handleChange}
                    >
                      <MenuItem value="curbside">Curbside Recycling</MenuItem>
                      <MenuItem value="drop-off">Drop-off Recycling</MenuItem>
                      <MenuItem value="composting">Composting</MenuItem>
                      <MenuItem value="E-waste Recycling">
                        E-waste Recycling
                      </MenuItem>
                    </Select>
                    <InputLabel htmlFor="recyclingMethod">
                      Recycling Method
                    </InputLabel>
                  </FormControl>
                  <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                    <Select
                      labelId="wasteType"
                      label="Waste Type"
                      id="wasteType"
                      name="wasteType"
                      value={values.wasteType}
                      onChange={handleChange}
                    >
                      <MenuItem value="Plastic">Plastic</MenuItem>
                      <MenuItem value="Paper">Paper</MenuItem>
                      <MenuItem value="Glass">Glass </MenuItem>
                      <MenuItem value="Metal">Metal</MenuItem>
                      <MenuItem value="Bottle">Bottle (Bottle)</MenuItem>
                      <MenuItem value="Can">Can (Can)</MenuItem>
                    </Select>
                    <InputLabel htmlFor="wasteType">Waste Type</InputLabel>
                  </FormControl>
                  <TextField
                    label="quantity"
                    id="quantity"
                    fullWidth
                    sx={{ margin: "1rem 0" }}
                    name="quantity"
                    value={values.quantity}
                    onChange={handleChange}
                    error={errors.quantity && touched.quantity}
                    helperText={
                      touched.quantity && errors.quantity ? (
                        <span style={{ color: "red" }}>{errors.quantity}</span>
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
                      disabled={isButtonDisabled}
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
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>
      {user.isAdmin ? <AggregatedTable/> :
      <Paper>
        <TableContainer>
          <Table>
            <TableHead style={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell style={{ color: "#ffffff" }}>
                  RECYCLING LOCATION
                </TableCell>
                <TableCell style={{ color: "#ffffff" }}>
                  RECYCLING METHOD
                </TableCell>
                <TableCell style={{ color: "#ffffff" }}>WASTE TYPE</TableCell>
                <TableCell style={{ color: "#ffffff" }}>
                  QUANTITY (KG)
                </TableCell>
                {/* <TableCell>Waste Types</TableCell> */}
                <TableCell style={{ color: "#ffffff" }}>CREATED AT</TableCell>

                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recyclingHistories.data &&
                recyclingHistories.data.map((row, index) => (
                  <TableRow key={row._id} sx={{backgroundColor: index % 2 !== 0 && theme.palette.neutral[800] }}>
                    {row.recyclingLocation ? (
                      <TableCell>
                        {row.recyclingLocation.locationName }
                      </TableCell>
                    ) : (
                      <TableCell>Undefined</TableCell>
                    )}

                    <TableCell>{row.recyclingMethod}</TableCell>
                    <TableCell>{row.wasteType}</TableCell>
                    <TableCell>{row.quantity.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(row.createdAt).toLocaleString()}
                    </TableCell>

                    <TableCell align="right">
                    <IconButton
                            aria-label="edit"
                            onClick={() => handleEdit(row._id)}
                            sx={{
                              borderRadius: "4px",
                              backgroundColor: "#007bff",
                              width: "24px",
                              height: "24px",
                              margin: "5px",
                              padding: "18px",
                            }}
                          >
                            <Edit sx={{ color: "#ffffff" }} />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDelete(row._id)}
                            sx={{
                              borderRadius: "4px",
                              backgroundColor: "#e00a33",
                              width: "24px",
                              height: "24px",
                              margin: "5px",
                              padding: "18px",
                            }}
                          >
                            <Delete sx={{ color: "#ffffff" }} />
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
      </Paper> }
      <Dialog open={openEditDialog} onClose={handleClose}>
        <DialogTitle>
          Edit Recycling History for{" "}
          {new Date(recyclingHistory.createdAt).toLocaleString()}
        </DialogTitle>

        <DialogContent
          sx={{
            width: isNonMobile ? 500 : null,
            maxWidth: isNonMobile ? null : 480,
          }}
        >
          <Formik
            initialValues={{
              id: recyclingHistory._id,
              recyclingLocationId: recyclingHistory.recyclingLocation,
              recyclingMethod: recyclingHistory.recyclingMethod,
              quantity: reverseCalculateQuantity(
                recyclingHistory.quantity,
                recyclingHistory.wasteType
              ),
              wasteType: recyclingHistory.wasteType,
            }}
            validationSchema={EditvalidationSchema}
             onSubmit={onSubmitEdit}
          >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                  <Select
                    labelId="locationName"
                    label="Recycling Location"
                    id="locationName"
                    name="recyclingLocationId"
                    value={values.recyclingLocationId}
                    onChange={handleChange}
                  >
                    {allRecycleLocations.data
                      .slice()
                      .sort((a, b) =>
                        a.locationName.localeCompare(b.locationName)
                      ) // Sort the options alphabetically
                      .map((data) => (
                        <MenuItem key={data._id} value={data._id}>
                          {data.locationName}
                        </MenuItem>
                      ))}
                  </Select>
                  <InputLabel htmlFor="locationName">
                    Recycling Location
                  </InputLabel>
                </FormControl>

                <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                  <Select
                    labelId="recyclingMethod"
                    label="Recycling Method"
                    id="recyclingMethod"
                    name="recyclingMethod"
                    value={values.recyclingMethod}
                    onChange={handleChange}
                  >
                    <MenuItem value="curbside">Curbside Recycling</MenuItem>
                    <MenuItem value="drop-off">Drop-off Recycling</MenuItem>
                    <MenuItem value="composting">Composting</MenuItem>
                    <MenuItem value="E-waste Recycling">
                      E-waste Recycling
                    </MenuItem>
                  </Select>
                  <InputLabel htmlFor="recyclingMethod">
                    Recycling Method
                  </InputLabel>
                </FormControl>
                <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                  <Select
                    labelId="wasteType"
                    label="Waste Type"
                    id="wasteType"
                    name="wasteType"
                    value={values.wasteType}
                    onChange={handleChange}
                  >
                    <MenuItem value="Plastic">Plastic</MenuItem>
                    <MenuItem value="Paper">Paper</MenuItem>
                    <MenuItem value="Glass">Glass </MenuItem>
                    <MenuItem value="Metal">Metal</MenuItem>
                    <MenuItem value="Bottle">Bottle (Bottle)</MenuItem>
                    <MenuItem value="Can">Can (Can)</MenuItem>
                  </Select>
                  <InputLabel htmlFor="wasteType">Waste Type</InputLabel>
                </FormControl>
                <TextField
                  label="quantity"
                  id="quantity"
                  fullWidth
                  sx={{ margin: "1rem 0" }}
                  name="quantity"
                  value={values.quantity}
                  onChange={handleChange}
                  error={errors.quantity && touched.quantity}
                  helperText={
                    touched.quantity && errors.quantity ? (
                      <span style={{ color: "red" }}>{errors.quantity}</span>
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
                      disabled={isButtonDisabled}
                      sx={{
                        padding: "0.5rem 1rem",
                        color: theme.palette.neutral[1000],
                        backgroundColor: theme.palette.primary.light,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      Edit
                    </Button>
                  </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RecyclingHistory;
