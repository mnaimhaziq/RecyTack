import styled from '@emotion/styled';
import { Box, Grid, Paper, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { Outlet, useNavigate} from "react-router-dom";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Education = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
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
          <Grid item xs={12} md={3}>
            <Link to="/education/benefit">
              <Item elevation={8} sx={{ backgroundColor: theme.palette.background.alt}}>
                Benefits of Recycling
              </Item>
            </Link>
          </Grid>
          <Grid item xs={12} md={3}>
            <Link to="/education/materials">
              <Item elevation={8} sx={{backgroundColor: theme.palette.background.alt}}>
                Types of Materials that Can be Recycled
              </Item>
            </Link>
          </Grid>
          <Grid item xs={12} md={3}>
            <Link to="/education/process">
              <Item elevation={8} sx={{ backgroundColor: theme.palette.background.alt}}>
                Recycling Process and Best Practices
              </Item>
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Outlet/>
    </Box>
  );
}

export default Education;