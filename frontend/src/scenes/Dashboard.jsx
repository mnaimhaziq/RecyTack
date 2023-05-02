import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Box, useMediaQuery,Paper, useTheme } from "@mui/material";
import Header from "../components/Header";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import WelcomeUser from "../components/WelcomeUser";
import { useDispatch, useSelector } from "react-redux";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  
}));

function Dashboard() {
  const page = null;
  const chartRef = useRef();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const recyclingHistories = useSelector(
    (state) => state.recycle.recyclingHistories.data
  );
 

  useEffect(() => {
    
    
    const chartInstance = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Recycling Waste",
            data: [120, 190, 90, 100, 220, 300],
            fill: true,
            borderColor: "#9c27b0",
            tension: 0.1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            color: "#ffffff", // change this to the color you want
          },
          legend: {
            labels: {
              color: "#ffffff", // change this to the color you want
            },
          },
        },
        scales: {
          y: {
            ticks: {
              beginAtZero: true,
              fontColor: "#ffffff",
              color: "#ffffff",
            },
            title: {
              display: true,
              text: "Recycling Waste",
              fontColor: "#ffffff",
            },
          },
          x: {
            ticks: {
              fontColor: "#ffffff",
              color: "#ffffff",
            },
          },
        },
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, []);

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
        <Header title="DASHBOARD" />
        
      </Box>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} >
  <Grid item xs={12} md={4} >
    <Item elevation={8} sx={{minHeight: "40vh", backgroundColor: theme.palette.background.alt}}><WelcomeUser user={user || {}}/></Item>
  </Grid>
  <Grid item xs={12} md={8}>
    <Item elevation={8} sx={{minHeight: "40vh", backgroundColor: theme.palette.background.alt}}>recycling History: {recyclingHistories ? recyclingHistories.length : 0}</Item>
  </Grid>
  <Grid item xs={12} md={6}>
    <Item elevation={8} sx={{minHeight: "60vh", backgroundColor: theme.palette.background.alt}}>xs=6 md=4</Item>
  </Grid>
  <Grid item xs={12} md={6}>
    <Item elevation={8} sx={{minHeight: "60vh", backgroundColor: theme.palette.background.alt}}>xs=6 md=8</Item>
  </Grid>
</Grid>
    </Box>
      <div>
        <canvas
          ref={chartRef}
          style={{
            width: "400px",
            height: "300px",
            maxWidth: "100%",
            maxHeight: "100%",
            margin: "0 auto",
            display: "block",
          }}
        />
      </div>
      
    </Box>
  );
}

export default Dashboard;
