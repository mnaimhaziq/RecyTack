import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button, Form } from "react-bootstrap";
import "./AuthScreen.css";
import { login } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getMostRecycledWasteType,
  getRecycleHistoryByUserIdAndPage,
} from "../features/recycle/recycleFunction/recyclingHistoryFunction";


const LoginScreen = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const page = null;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { user, isLoading, isSuccess, isError } = auth;

  

  useEffect(() => {
    const dispatchForDashboard = async () => {
      await dispatch(
        getRecycleHistoryByUserIdAndPage({
          id: user._id,
          page,
          token: user.token,
        })
      )
      .then(() =>{dispatch(getMostRecycledWasteType({id: user._id, token: user.token}));})
      .then(() =>{navigate("/dashboard");})
    }

    if (isSuccess || user) {
      dispatchForDashboard();
    }
  
    if (isError) {
      toast.error("Invalid Credentials. ");
      return;
    }
  }, [user, isSuccess, isError, navigate, dispatch]);
  

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.error("Please fill in all required fields.");
      return;
    } else {
      const userData = {
        email,
        password,
      };
      await dispatch(login(userData));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="auth-body">
      <ToastContainer />
      <Card className="auth ">
        <Card.Title as="h2" className="text-center mb-5">
          Login
        </Card.Title>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3 " controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={email}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
          <p>
            {" "}
            New User? <Link to={"/register"}>Register</Link>
          </p>
        </Form>
      </Card>
    </div>
  );
};

export default LoginScreen;
