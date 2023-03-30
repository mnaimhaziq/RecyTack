import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Layout() {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      {user && (
        <Sidebar
          user={user || {}}
          isNonMobile={isNonMobile}
          drawerWidth="250px"
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
      <Box flexGrow={1}>
        {user && (
          <Navbar
            user={user || {}}
            isNonMobile={isNonMobile}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}
        { <Outlet  />}
      </Box>
    </Box>
  );
}

export default Layout;
