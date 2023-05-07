import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  useMediaQuery,
  Paper,
  useTheme,
  Container,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import Header from "../components/Header";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { DashboardTotalRecycling } from "../sections/DashboardTotalRecycling";
import { DashboardPoint } from "../sections/DashboardPoint";
import { DashboardMostType } from "../sections/DashboardMostType";
import { DashboardTypeOfRecycling } from "../sections/DashboardTypeOfRecycling";
import { getRecycleHistoryByUserId, getMostRecycledWasteType } from "../features/recycle/recycleSlice";
import { DashboardWelcome } from "../sections/DashboardWelcome";
import { DashboardLatestHistory } from "../sections/DashboardLatestHistory";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Dashboard() {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const dispatch = useDispatch();
  const recyclingHistories = useSelector(
    (state) => state.recycle.recyclingHistories
  );
  const  recyclingHistoriesTop8 = useSelector(
    (state) => state.recycle.recyclingHistoriesTop8.data
  );
  const  mostRecycledWasteType = useSelector(
    (state) => state.recycle.mostRecycledWasteType.mostRecycledWasteType
  );
 
  useEffect(() => {
    dispatch(getRecycleHistoryByUserId({ id: user._id, token: user.token }));
    dispatch(getMostRecycledWasteType({id: user._id, token: user.token}))
  }, [dispatch, user]);

  return (
    <Box m="1.5rem 2.5rem " p="0 0 4rem 0">
      <Box
        display={isNonMobile ? "flex" : "block"}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          margin: "3rem"
        }}
      >
        <Header title="DASHBOARD" />
      </Box>

      <Box component="main" sx={{ flexGrow: 1, py: 2 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <DashboardWelcome
                sx={{
                  height: "100%",
                  backgroundColor: theme.palette.background.alt,
                }}
                value={75.5}
                user={user}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <DashboardTotalRecycling
                difference={12}
                positive
                sx={{
                  height: "100%",
                  backgroundColor: theme.palette.background.alt,
                }}
                value={recyclingHistories.length}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <DashboardPoint
                difference={16}
                positive={false}
                sx={{
                  height: "100%",
                  backgroundColor: theme.palette.background.alt,
                }}
                value="230"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <DashboardMostType
                type={mostRecycledWasteType}
                sx={{
                  height: "100%",
                  backgroundColor: theme.palette.background.alt,
                }}
              
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <DashboardTypeOfRecycling
                chartSeries={[63, 15, 22]}
                labels={["Paper", "Bottle", "Plastic"]}
                sx={{
                  height: "100%",
                  backgroundColor: theme.palette.background.alt,
                }}
              />
            </Grid>

            <Grid
            xs={12}
            md={6}
            lg={8}
          >
           
            <DashboardLatestHistory
              recyclingHistoriesTop8={recyclingHistoriesTop8}
              sx={{ height: '100%' }}
            />
          </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
