import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, useMediaQuery, useTheme } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useDispatch, useSelector } from 'react-redux';
import { createRecyclingHistory, deleteRecycleHistory, getAllRecyclingHistories, updateRecycleHistoryById } from '../features/recycle/recycleFunction/recyclingHistoryFunction';
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from "react-toastify";
import { Add, Edit, Delete} from "@mui/icons-material";
import { getAllRecycleLocation } from '../features/recycle/recycleFunction/recycleLocationFunction';

const AggregatedTable = () => {
    const [editedRow, setEditedRow] = useState({});
    const [AddRow, setAddRow] = useState({});
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme(); // Access the theme object
  
  const isNonMobile = useMediaQuery("(min-width: 942px)");

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const allRecyclingHistories = useSelector(
    (state) => state.recycle.allRecyclingHistories.data
  );

  const allRecycleLocations = useSelector(
    (state) => state.recycle.allRecycleLocations
  );

  useEffect(() => {
    dispatch(getAllRecycleLocation(user.token));
    dispatch(getAllRecyclingHistories(user.token));
   
  }, [dispatch, user.token, openEditDialog, AddRow]);

  const formatDate = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString('en-US');
  };

  const getTotalQuantity = () => {
    return allRecyclingHistories.reduce((total, item) => total + item.quantity, 0);
  };

  const getMostCommonWasteType = () => {
    const wasteTypeCount = {};
    allRecyclingHistories.forEach((item) => {
      const wasteType = item.wasteType;
      wasteTypeCount[wasteType] = (wasteTypeCount[wasteType] || 0) + item.quantity;
    });
  
    let mostCommonWasteType = '';
    let maxCount = 0;
    for (const wasteType in wasteTypeCount) {
      if (wasteTypeCount[wasteType] > maxCount) {
        mostCommonWasteType = wasteType;
        maxCount = wasteTypeCount[wasteType];
      }
    }
  
    return mostCommonWasteType;
  };

  const onRowEdit = (rowData) => {
    setEditedRow(rowData);
    setOpenEditDialog(true);
  };

  const onRowAdd = (rowData) => {
    setAddRow(rowData);
    setOpenAddDialog(true);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
    setOpenAddDialog(false);
    setAddRow({});
    setEditedRow({});
  }; 

  const initialValues = {
    recyclingLocationId: "",
    recyclingMethod: "",
    quantity: "",
    wasteType: "",
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
        dispatch(deleteRecycleHistory({ id, token: user.token })).then(() => {
          dispatch(getAllRecyclingHistories(user.token));
          toast.error("Recycling History Has Been Deleted");
        });
      }
    });
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

  const validationSchema = Yup.object().shape({
    recyclingLocationId: Yup.string().required("This field is Required"),
    recyclingMethod: Yup.string().required("This field is Required"),
    quantity: Yup.number()
      .typeError("Must be a number")
      .required("This field is Required"),
  });

  const onSubmitEdit = async (values, { resetForm }) => {
    const { recyclingLocationId, recyclingMethod, quantity, wasteType } =
      values;

    const newFormData = {
      recyclingLocationId,
      recyclingMethod,
      quantity: calculateQuantity(quantity, wasteType),
      wasteType,
    };
    const id = editedRow.id;

    await dispatch(
      updateRecycleHistoryById({ id, newFormData, token: user.token })
    );
   dispatch(getAllRecyclingHistories(user.token));
   setOpenEditDialog(false);    
    toast.success("Recycling History Has Been Edited ");
    resetForm();
   
  };

  const onSubmit = async (values, { resetForm }) => {
    const { recyclingLocationId, recyclingMethod, quantity, wasteType  } =
      values;
      const user_id = AddRow.user_id
    const newFormData = {
      recyclingLocationId,
      recyclingMethod,
      quantity: calculateQuantity(quantity, wasteType),
      wasteType,
      user_id
    };

    await dispatch(
      createRecyclingHistory({ newFormData, token: user.token })
    )
      dispatch(getAllRecyclingHistories(user.token));
    
    
    setOpenAddDialog(false);
    toast.success(`New Recycling History Created for user ${AddRow.user} `);
    resetForm();
  };



  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'user',
      },
      {
        header: 'id',
        accessorKey: 'id',
      },
      {
        header: 'recyclingLocationId',
        accessorKey: 'recyclingLocationId',
      },
      {
        header: 'Recycling Location',
        accessorKey: 'recyclingLocation',
      },
      {
        header: 'Quantity',
        accessorKey: 'quantity',
        aggregationFn: 'sum',
        Cell: ({ cell }) => <>{cell.getValue().toFixed(2)} kg</>,
        AggregatedCell: ({ cell }) => (
          <>
            Total Quantity:{' '}
            <Box color={theme.palette.primary.main}>{cell.getValue().toFixed(2)} kg</Box>
          </>
        ),
        Footer: () => (
          <Stack>
            Total Quantity:
            <Box color={theme.palette.primary.main}>{getTotalQuantity().toFixed(2)} kg</Box>
          </Stack>
        ),
      },
      {
        header: 'Waste Type',
        accessorKey: 'wasteType',
        Footer: () => (
          <Stack>
            Most Common Waste Type:
            <Box color={theme.palette.primary.main}>{getMostCommonWasteType()}</Box>
          </Stack>
        ),
      },
      {
        header: 'Date Created',
        accessorKey: 'createdAt',
        Cell: ({ cell }) => <>{formatDate(cell.getValue())}</>,
      },
      {
        header: 'Date Updated',
        accessorKey: 'updatedAt',
        Cell: ({ cell }) => <>{formatDate(cell.getValue())}</>,
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        size: 100,
        AggregatedCell: ({row}) => (
          <IconButton
          aria-label="Add"
          onClick={() => onRowAdd(row.original)}
        >
          <Add />
        </IconButton>
        ),
        Cell: ({ row }) => (
      <>    <IconButton
          aria-label="edit"
          onClick={() => onRowEdit(row.original)}
          sx={{
            borderRadius: "4px",
            backgroundColor: "#007bff",
            width: "24px",
            height: "24px",
            margin: "5px",
            padding: "15px"
          }}
        >
          <Edit sx={{ color: "#ffffff" }} />
        </IconButton>
        <IconButton
          aria-label="delete"
          onClick={() => handleDelete(row.original.id)}
          sx={{
            borderRadius: "4px",
            backgroundColor: "#e00a33",
            width: "24px",
            height: "24px",
            margin: "5px",
            padding: "15px"
          }}
        >
          <Delete sx={{ color: "#ffffff" }} />
        </IconButton>
        </>
          ),
      },
    ],
    [allRecyclingHistories, theme.palette.neutral] // Include theme.palette.neutral in the dependencies
  );

  return (
   <> {allRecyclingHistories && (
  <> <MaterialReactTable
        columns={columns}
        data={allRecyclingHistories}
        enableColumnResizing
        enableGrouping
        enableStickyHeader
        enableStickyFooter
        initialState={{
          expanded: true, //expand all groups by default
          grouping: ['user'], //an array of columns to group by by default (can be multiple)
          pagination: { pageIndex: 0, pageSize: 20 },
          sorting: [{ id: 'user', desc: false }], //sort by state by default
          columnVisibility: { id: false, recyclingLocationId: false,  } 
        }}
        muiToolbarAlertBannerChipProps={{ color: 'primary' }}
        muiTableContainerProps={{ sx: { maxHeight: 700} }}
        defaultColumn={{
          minSize: 20, //allow columns to get smaller than default
          maxSize: 9001, //allow columns to get larger than default
          size: 150, //make columns wider by default
        }}
        
      /> </>
    )}

        <Dialog open={openEditDialog} onClose={handleClose}>
        <DialogTitle>Edit Recycling History for User : {editedRow.user}</DialogTitle>

        <DialogContent  sx={{
              width: isNonMobile ? 500 : null,
              maxWidth: isNonMobile ? null : 480,
            }}
          >
             <Formik
            initialValues={{
              id: editedRow.id,
              recyclingLocationId: editedRow.recyclingLocationId,
              recyclingMethod: editedRow.recyclingMethod,
              quantity: reverseCalculateQuantity(
                editedRow.quantity,
                editedRow.wasteType
              ),
              wasteType: editedRow.wasteType,
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

        <Dialog open={openAddDialog} onClose={handleClose}>
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
    </>
  );
};

export default AggregatedTable;
