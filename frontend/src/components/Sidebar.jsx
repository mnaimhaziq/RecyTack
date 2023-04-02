import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import ProfileImage from "../assets/profile.jpeg";
import "./Sidebar.css";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  History,
  ChevronRightOutlined,
  HomeOutlined,
  Domain,
  Feedback,
  Article,
  Leaderboard,
  BarChart,
  Logout,
  AccountCircle,
  GroupAdd,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";

import { logout, reset } from "../features/auth/authSlice";

const UserNavItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Recycling History",
    icon: <History />,
  },
  {
    text: "Education",
    icon: <Article />,
  },
  {
    text: "Leaderboard",
    icon: <Leaderboard />,
  },
  {
    text: "Data Visualization",
    icon: <BarChart />,
  },
  {
    text: "Feedback",
    icon: <Feedback />,
  },
  {
    text: "User",
    icon: null,
  },
  {
    text: "Profile",
    icon: <AccountCircle />,
  },
  {
    text: "Logout",
    icon: <Logout />,
  },
];

const AdminNavItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Users",
    icon: <GroupAdd />,
  },
  {
    text: "Education",
    icon: <Article />,
  },
  {
    text: "Recycling Location",
    icon: <Domain />,
  },
  {
    text: "Leaderboard",
    icon: <Leaderboard />,
  },
  {
    text: "Data Visualization",
    icon: <BarChart />,
  },
  {
    text: "Feedbacks",
    icon: <Feedback />,
  },
  {
    text: "User",
    icon: null,
  },
  {
    text: "Profile",
    icon: <AccountCircle />,
  },
  {
    text: "Logout",
    icon: <Logout />,
  },
];

function Sidebar({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  const navItems = user && user.isAdmin ? AdminNavItems : UserNavItems;

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography
                    m="0 0 0  2rem "
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: theme.palette.green.main }}
                  >
                    RECYTRACK
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List sx={{ paddingBottom: "1.5rem" }}>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography
                      key={text}
                      sx={{ m: "2.25rem 0 1rem 3rem" }}
                      fontWeight="bold"
                    >
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase().replace(/\s+/g, '');;

                return (
                  <ListItem key={text} sx={{ p: "0.3rem 0" }}>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.green.main
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.neutral[1000]
                            : theme.palette.secondary[100],
                        "&:hover": {
                          color:
                            active === lcText
                              ? theme.palette.neutral[10]
                              : theme.palette.green.main,
                          "& .MuiListItemIcon-root": {
                            color:
                              active === lcText
                                ? theme.palette.neutral[10]
                                : theme.palette.green.main
                          },
                          "& .MuiListItemText-primary": {
                            color:
                              active === lcText
                                ? theme.palette.neutral[10]
                                : theme.palette.green.main,
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.neutral[1000]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={text}
                        sx={{ fontSize: "0.87rem" }}
                      />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
}

export default Sidebar;
