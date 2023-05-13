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
} from "../features/recycle/recycleFunction/recyclingHistoryFunction";
import { getAllRecycleLocation } from "../features/recycle/recycleFunction/recycleLocationFunction";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { ToastContainer, toast } from "react-toastify";

const RecyclingHistory = () => {
  const [open, setOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();

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
      toast.error("Recycling Location Has Been Deleted ");
    }
  };

  const initialValues = {
    recyclingLocationId: "",
    recyclingMethod: "",
    quantity: "",
    wasteType: "",
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

  const onSubmit = async (values, { resetForm }) => {
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
    toast.success("New Recycling History Created ");
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
    toast.success("Recycling History Has Been Edited ");
    resetForm();
    setOpenEditDialog(false);
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
            <Add /> Create New Recycling History
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
                  <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                    <Select
                      labelId="locationName"
                      label="Recycling Location"
                      id="locationName"
                      name="recyclingLocationId"
                      value={values.recyclingLocationId}
                      onChange={handleChange}
                    >
                      {recycleLocations.data
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
                      Create
                    </Button>
                  </DialogActions>
                </Form>
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
                recyclingHistories.data.map((row, idx) => (
                  <TableRow key={row._id}>
                    {row.recyclingLocation ? (
                      <TableCell>
                        {row.recyclingLocation.locationName }
                      </TableCell>
                    ) : (
                      <TableCell>Undefined</TableCell>
                    )}

                    <TableCell>{row.recyclingMethod}</TableCell>
                    <TableCell>{row.wasteType}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>
                      {new Date(row.createdAt).toLocaleString()}
                    </TableCell>

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
            validationSchema={validationSchema}
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
                    {recycleLocations.data
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
                    Create
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
