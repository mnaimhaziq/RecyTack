import styled from "@emotion/styled";
import { Box, Button, Grid, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { Outlet, useNavigate } from "react-router-dom";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  
}));

const Education = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Box m="1.5rem 2.5rem " p="0 0 4rem 0">
      <Box
        display={isNonMobile ? "flex" : "block"}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          mb: "3rem",
        }}
      >
        <Header title="EDUCATION" />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} >
            
              <Item
                elevation={8}
                sx={{
                  backgroundColor: theme.palette.background.alt,
                }}
              >
                <Button onClick={navigate(`/education/benefit`)}>
                  <Typography
              color="text.secondary"
              variant="h6"
            >
             Benefits of Recycling
            </Typography>  
            </Button> 
                 
             
            </Item>
          </Grid>
          <Grid item xs={12} md={3}>
            
              <Item
                elevation={8}
                sx={{ backgroundColor: theme.palette.background.alt }}
              >
                <Button onClick={navigate("/education/materials")}>
                 <Typography
              color="text.secondary"
              variant="h6"
            >
              Types of Materials that Can be Recycled
            </Typography>  
            </Button>
               
               
              </Item>
         
          </Grid>
          <Grid item xs={12} md={3}>
            
              <Item
                elevation={8}
                sx={{ backgroundColor: theme.palette.background.alt }}
              >
                <Typography
              color="text.secondary"
              variant="h6"
            >
              Recycling Process and Best Practices
            </Typography>  
                
              </Item>
            
          </Grid>
        </Grid>
      </Box>
      <Outlet />
    </Box>
  );
};

export default Education;
