import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "./AuthScreen.css";
import { login, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { user, isLoading, isSuccess, isError, message } = auth;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };
    dispatch(login(userData))
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="auth-body">
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
