import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "./AuthScreen.css";
import { register, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

const Register = () => {
  const [userImg, setUserImg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  const { name, email, password, confirmPassword, address } = formData;
  const { street, city, postalCode, country } = address;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { user, isLoading, isSuccess, isError, message } = auth;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    TransformFileData(file);
  };

  const TransformFileData = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setUserImg(reader.result);
      };
    } else {
      setUserImg("");
    }
  };

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/dashboard");
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    if (e.target.name.startsWith("address.")) {
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [e.target.name.split(".")[1]]: e.target.value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (
      name === "" ||
      password === "" ||
      email === "" ||
      confirmPassword === "" ||
      userImg === "" ||
      street === "" ||
      city === "" ||
      postalCode === "" ||
      country === ""
    ){
      toast.error("Please fill in all required fields.")
      return;
    }
      if (password !== confirmPassword) {
        toast.error("Password do not match");
      } else {
        const userData = {
          name,
          email,
          password,
          picture: userImg,
          address: {
            street: street,
            city: city,
            postalCode: postalCode,
            country: country,
          },
        };
        dispatch(register(userData));
      }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="register-body">
      <ToastContainer />
      <Card className="register">
        <Card.Title as="h2" className="text-center mb-2">
          Register
        </Card.Title>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-2 " controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              name="name"
              value={name}
              onChange={onChange}
              autoComplete="off"
            />
          </Form.Group>
          <Form.Group className="mb-2 " controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={email}
              onChange={onChange}
              autoComplete="new-password"
            />
          </Form.Group>
          <div className="d-flex">
            <Form.Group className="mb-2 me-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                autoComplete="new-password"
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                autoComplete="off"
              />
            </Form.Group>
          </div>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
          </Form.Group>
          <div className="d-flex">
            <Form.Group className="mb-2 me-3" controlId="address.street">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter street"
                name="address.street"
                value={formData.address.street}
                onChange={onChange}
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="address.city">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                name="address.city"
                value={formData.address.city}
                onChange={onChange}
                autoComplete="off"
              />
            </Form.Group>
          </div>
          <div className="d-flex">
            <Form.Group className="mb-2 me-3" controlId="address.postalCode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter postal code"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={onChange}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="address.country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter country"
                name="address.country"
                value={formData.address.country}
                onChange={onChange}
                autoComplete="off"
              />
            </Form.Group>
          </div>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <p>
            {" "}
            Have an account? <Link to={"/login"}>Login</Link>
          </p>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
