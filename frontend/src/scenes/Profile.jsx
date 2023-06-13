import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  useTheme,
  Button,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Header from "../components/Header";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const dispatch = useDispatch();

  const theme = useTheme();

  const initialValues = {
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    phoneNumber: user.phoneNumber,
    street: user.address.street,
    city: user.address.city,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is Required"),
    email: Yup.string().email().required("This field is Required"),
    city: Yup.string().required("This field is Required"),
    postalCode: Yup.string().required("This field is Required"),
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
    const { name, email } = values;

    const newFormData = {
      name,
      email,
    };
  };

  return (
    <Box m="1.5rem 2.5rem " p="0 0 4rem 0">
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <Header title="Personal Information" />
      </Box>

      <Box>
      <img src={user.picture.url} width="30px"/>        

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, handleChange, handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <Grid container  sx={{ mt: 2 }} padding="1.5rem 12rem ">
                <Grid item xs={12}>
                  <Paper elevation={3}
                    sx={{ borderRadius: "1rem 0 0  1rem", backgroundColor: "theme", p:"2rem 4rem"}}
                  >
                    <Box p={2} sx={{ minHeight: "60vh" }}>
                      <TextField
                        label="name"
                        id="name"
                        fullWidth
                        sx={{ my: 2 }}
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        error={errors.name && touched.name}
                        helperText={
                          touched.name && errors.name ? (
                            <span style={{ color: "red" }}>{errors.name}</span>
                          ) : null
                        }
                        disabled={!editMode} // disable the input field when not in edit mode
                      />

                      <TextField
                        label="email"
                        id="email"
                        fullWidth
                        sx={{ my: 2 }}
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={errors.email && touched.email}
                        helperText={
                          touched.email && errors.email ? (
                            <span style={{ color: "red" }}>{errors.email}</span>
                          ) : null
                        }
                        disabled={!editMode} // disable the input field when not in edit mode
                      />

                      <TextField
                        label="Role (Only Admin Can Edit)"
                        id="isAdmin"
                        fullWidth
                        sx={{ my: 2 }}
                        name="isAdmin"
                        value={values.isAdmin ? "Admin" : "User"}
                        onChange={handleChange}
                        disabled
                      />

                      <TextField
                        label="Phone Number"
                        id="phoneNumber"
                        fullWidth
                        sx={{ my: 2 }}
                        name="PhoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        error={errors.phoneNumber && touched.phoneNumber}
                        helperText={
                          touched.phoneNumber && errors.phoneNumber ? (
                            <span style={{ color: "red" }}>{errors.phoneNumber}</span>
                          ) : null
                        }
                        disabled={!editMode} // disable the input field when not in edit mode
                      />

<TextField
                        label="Street"
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
                        disabled={!editMode} // disable the input field when not in edit mode
                      />

                      <TextField
                        label="City"
                        id="city"
                        fullWidth
                        sx={{ my: 2 }}
                        name="city"
                        value={values.cityl}
                        onChange={handleChange}
                        error={errors.city && touched.city}
                        helperText={
                          touched.city && errors.city ? (
                            <span style={{ color: "red" }}>{errors.city}</span>
                          ) : null
                        }
                        disabled={!editMode} // disable the input field when not in edit mode
                      />

                      <TextField
                        label="Role (Only Admin Can Edit)"
                        id="isAdmin"
                        fullWidth
                        sx={{ my: 2 }}
                        name="isAdmin"
                        value={values.isAdmin ? "Admin" : "User"}
                        onChange={handleChange}
                        disabled
                      />

                      <TextField
                        label="Phone Number"
                        id="phoneNumber"
                        fullWidth
                        sx={{ my: 2 }}
                        name="PhoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        error={errors.phoneNumber && touched.phoneNumber}
                        helperText={
                          touched.phoneNumber && errors.phoneNumber ? (
                            <span style={{ color: "red" }}>{errors.phoneNumber}</span>
                          ) : null
                        }
                        disabled={!editMode} // disable the input field when not in edit mode
                      />
                      {editMode ? ( // conditionally render the submit button based on whether the form is in edit mode or not
                        <>
                          <Button
                            onClick={() => setEditMode(false)} // enable edit mode when the user clicks the "edit" button
                            sx={{
                              color: theme.palette.neutral[10],
                              backgroundColor: theme.palette.primary.main,
                              mr: "1rem",
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            type="submit"
                            sx={{
                              color: theme.palette.neutral[10],
                              backgroundColor: theme.palette.primary.main,
                            }}
                            onClick={() => setEditMode(false)}
                          >
                            Update
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => setEditMode(true)} // enable edit mode when the user clicks the "edit" button
                          sx={{
                            color: theme.palette.neutral[10],
                            backgroundColor: theme.palette.primary.main,
                          }}
                        >
                          Edit
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Profile;
