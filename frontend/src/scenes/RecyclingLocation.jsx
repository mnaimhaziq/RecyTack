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
  FormGroup,Checkbox, FormControlLabel,
  IconButton,
} from "@mui/material";
import {
  Edit,
  Delete
} from "@mui/icons-material";
import Header from "../components/Header";
import {
  getAllRecycleLocation,
  getAllWasteTypes,
  deleteRecycleCollection,
} from "../features/recycle/recycleSlice";

const RecyclingLocation = () => {
  const [open, setOpen] = useState(false);
  const [acceptedWasteTypes, setAcceptedWasteTypes] = useState([]);

  const auth = useSelector((state) => state.auth);
  const recycleLocation = useSelector((state) => state.recycle.recycleLocation);
  const wasteTypes = useSelector((state) => state.recycle.wasteType);

  const { user } = auth;
  const dispatch = useDispatch();

  const handleWasteTypeChange = (event) => {
    const { name, checked } = event.target;
    setAcceptedWasteTypes((prev) =>
      checked ? [...prev, name] : prev.filter((wasteType) => wasteType !== name)
    );
  };



  useEffect(() => {
    dispatch(getAllRecycleLocation(user.token));
    dispatch(getAllWasteTypes(user.token));
  }, [dispatch, user.token]);

  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

 

  const handleEdit = () => {}
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      dispatch(deleteRecycleCollection({ id, token: user.token }));
      dispatch(getAllRecycleLocation(user.token));
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="RECYCLING LOCATION" />
      <div>
        <Button
          sx={{ m: "1rem 0" }}
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
        >
          Create New Recycling Location
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Recycling Collection Location</DialogTitle>
          <DialogContent>
            <form>
              <TextField label="Location Name" fullWidth sx={{ my: 2 }} />
              <TextField label="Street Address" fullWidth sx={{ my: 2 }} />
              <TextField label="City" fullWidth sx={{ my: 2 }} />
              <TextField label="Postal Code" fullWidth sx={{ my: 2 }} />
              <TextField label="Country" fullWidth sx={{ my: 2 }} />
              <TextField label="Contact Number" fullWidth sx={{ my: 2 }} />
              <TextField label="Latitude" fullWidth sx={{ my: 2 }} />
              <TextField label="Longitude" fullWidth sx={{ my: 2 }} />
              <FormGroup>
                {wasteTypes.map((wasteType) => (
                  <FormControlLabel
                    key={wasteType._id}
                    control={
                      <Checkbox
                        name={wasteType._id}
                        checked={acceptedWasteTypes.includes(wasteType._id)}
                        onChange={handleWasteTypeChange}
                      />
                    }
                    label={wasteType.name}
                  />
                ))}
              </FormGroup>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Location Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Waste Types</TableCell>
                <TableCell>Latitude</TableCell>
                <TableCell>Longitude</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {recycleLocation.map((row) => (
    <TableRow key={row._id}>
      <TableCell>{row.locationName}</TableCell>
      <TableCell>{`${row.address.street}, ${row.address.city}, ${row.address.postalCode}, ${row.address.country}`}</TableCell>
      <TableCell>{row.contactNumber}</TableCell>
      
      <TableCell align="center">
      {row.acceptedWasteTypes.join(", ")}
</TableCell>
      <TableCell>{row.latitude}</TableCell>
      <TableCell>{row.longitude}</TableCell>
      <TableCell align="right">
        <IconButton aria-label="edit" onClick={() => handleEdit(row._id)}>
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
  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default RecyclingLocation;
