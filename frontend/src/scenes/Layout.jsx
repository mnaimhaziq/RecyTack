import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet, useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";


function Layout() {
  const isNonMobile = useMediaQuery("(min-width: 942px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  // const navigate = useNavigate(); 

 

  // useEffect(() => {
  //   // redirect to login page if user is null
  //   if(!user &&  window.location.pathname === '/register'){
  //     navigate('/register')
  //   }
  //   else if(!user &&  window.location.pathname === '/login'){
  //     navigate('/login')
  //   }
  //   else if(!user &&  window.location.pathname === '/home'){
  //     navigate('/home')
  //   }
  //   else if (!user ) {
  //     navigate('/home');
  //   }
  // }, [user, navigate]);

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
        { <Outlet />}
        
      </Box>
    </Box>
  );
}

export default Layout;
