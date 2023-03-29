import React, { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Form, Button, Row, Col } from "react-bootstrap";

import FlexBetween from "../components/FlexBetween";
import Header from "../components/Header";
import ProfileImage from "../assets/profile.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../features/auth/authSlice";

function Profile() {
  const isNonMobile = useMediaQuery("(min-width:1000px)");
  const theme = useTheme();

  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        updateProfile({
          token: user.token,
          id: user._id,
          name,
          email,
          password,
        })
      );
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title=" PROFILE" />
      <Row style={{ marginTop: "2rem" }}>
        <Col>
          {" "}
          <Box
            sx={{
              backgroundColor: theme.palette.background.alt,
              height: "70vh",
            }}
            borderRadius="20px"
            p="5rem 15rem"
          >
            <Box
              component="img"
              alt="profile"
              src={ProfileImage}
              height="40px"
              width="40px"
              borderRadius="50%"
              sx={{ objectFit: "cover" }}
            />
            <Box textAlign="left">
              <Typography
                fontWeight="bold"
                fontSize="0.9rem"
                sx={{ color: theme.palette.secondary[100] }}
              >
                {user.name}
              </Typography>
              <Typography
                fontSize="0.8rem"
                sx={{ color: theme.palette.secondary[200] }}
              >
                {user.isAdmin ? "Admin" : "User"}
              </Typography>
            </Box>
          </Box>
        </Col>
        <Col>
          {" "}
          <Box
            sx={{
              backgroundColor: theme.palette.background.alt,
              height: "70vh",
            }}
            borderRadius="20px"
            p="5rem 10rem"
          >
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password Address</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <button type="submit" variant="primary" className="my-3">
                Update
              </button>
            </Form>
          </Box>
        </Col>
      </Row>
    </Box>
  );
}

export default Profile;
