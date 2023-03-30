import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useTheme } from "@mui/material";

function Users({ user }) {
  const theme = useTheme();
  return (
    <Card
      className="my-3 p-3 rounded"
      style={{
        backgroundColor: theme.palette.background.alt,
        borderRadius: "10px",
      }}
    >
      <Link to={``}>
        <Card.Img src={user.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${user._id}`} style={{ textDecoration: "none" }}>
          <Card.Title as="div">
            <strong>{user.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">{user.email}</Card.Text>
        {user.isAdmin ? (
          <Card.Text>Admin</Card.Text>
        ) : (
          <Card.Text>User</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
}

export default Users;
