import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { Paper, useTheme, Typography, Avatar, Box } from "@mui/material";

function Users({ user }) {
  const theme = useTheme();
  return (
    <Paper
      elevation={6}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        m: 2,
        backgroundColor: theme.palette.background.alt
      }}
    >
      {user.picture && (
        <Avatar
          alt={user.name}
          src={user.picture.url}
          sx={{ width: 80, height: 80 }}
        />
      )}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="h6">{user.name}</Typography>
        <Typography
          variant="body1"
          sx={{ color: theme.palette.text.secondary }}
        >
          {user.email}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {user.isAdmin ? "Admin" : "User"}
        </Typography>
        <Link to={`/users/${user.id}`}>
          <Card.Link sx={{ mt: 2 }}>View Profile</Card.Link>
        </Link>
      </Box>
    </Paper>
  );
}

export default Users;
