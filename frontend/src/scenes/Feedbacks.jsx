import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Pagination,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { Formik } from 'formik';
import { createFeedback, getAllFeedback } from '../features/feedback/FeedbackFunction/FeedbackFunction';
import Header from '../components/Header';
import { Table } from 'react-bootstrap';

function Feedbacks() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isNonMobile = useMediaQuery('(min-width: 942px)');

  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const feedback = useSelector((state) => state.feedback);
  const { feedbacks } = feedback;

  const initialValues = {
    comment: ''
  };

  useEffect(() => {
    dispatch(getAllFeedback(user.token));
  }, [dispatch, user.token]);

  const submitHandler = async (values, { resetForm }) => {
    const { comment } = values;
    if (comment === '') {
      toast.error('Please fill in all required fields.');
      return;
    } else {
      const feedback = {
        comment
      };
      await dispatch(createFeedback({ feedback, token: user.token }));
      toast.success('Your Feedback has been submitted');
      resetForm();
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <ToastContainer theme="colored" />
      <Box
        display={isNonMobile ? 'flex' : 'block'}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          m: '2rem 2rem 3rem'
        }}
      >
        <Header title="Feedback" />
      </Box>
      {!user.isAdmin && <Grid xs={12}>
        <Paper elevation={3} sx={{ width: isNonMobile ? '50%' : '100%', padding: '1rem' }}>
          <Formik initialValues={initialValues} onSubmit={submitHandler}>
            {({ values, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Comment"
                  id="comment"
                  fullWidth
                  sx={{ my: 2 }}
                  name="comment"
                  value={values.comment}
                  onChange={handleChange}
                />

                <Button
                  type="submit"
                  sx={{
                    padding: '0.5rem 1rem',
                    color: theme.palette.neutral[1000],
                    backgroundColor: theme.palette.primary.light,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main
                    }
                  }}
                >
                  Submit
                </Button>
              </form>
            )}
          </Formik>
        </Paper>
      </Grid>}
      {user.isAdmin && <Paper>
        <TableContainer>
          <Table>
            <TableHead style={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell style={{ color: "#ffffff" }}>
                  Name
                </TableCell>
                <TableCell style={{ color: "#ffffff" }}>
                  Comment
                </TableCell>
                <TableCell style={{ color: "#ffffff" }}>CREATED AT</TableCell>

                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks &&
                feedbacks.map((feedback, idx) => (
                  <TableRow key={feedback._id}>
                   
                      <TableCell>
                        {feedback.user.name }
                      </TableCell>
                  

                    <TableCell>{feedback.comment}</TableCell>
                    <TableCell>{new Date(feedback.timestamp).toLocaleString()}</TableCell>
                   

                   
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
    
      </Paper>}
    </Box>
  );
}

export default Feedbacks;
