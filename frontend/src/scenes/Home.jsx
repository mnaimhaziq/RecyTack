import React from "react";
import { Box, AppBar, Toolbar, Button, Typography, styled} from "@mui/material";
import { Container } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HomeIcon from "@mui/icons-material/Home";
import ContactsIcon from "@mui/icons-material/Contacts";
import {useNavigate} from "react-router-dom"
import { useSelector } from "react-redux"; 
import recycleLogo from "../assets/recycleLogo.png"
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,

} from "@mui/material";
import { useState } from "react";
import { LinkOffTwoTone } from "@mui/icons-material";
import HeroImg from "../assets/HeroImg.png"
const Home = () => {
  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(5),
    marginTop: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
  }));

  const Title = styled(Typography)(({ theme }) => ({
    fontSize: "64px",
    color: "#000336",
    fontWeight: "bold",
    margin: theme.spacing(4, 0, 4, 0),
    [theme.breakpoints.down("sm")]: {
      fontSize: "40px",
    },
  }));

  return <>
     <Box sx={{ backgroundColor: "#E6F0FF", minHeight: "100vh" }}>
      <Container>
        <Navbar />
        <CustomBox sx={{mt: 7}}>
          <Box sx={{ flex: "1" }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "18px",
                color: "#687690",
                fontWeight: "500",
                mt: 10,
                mb: 4,
              }}
            >
              Welcome to RecyTrack
            </Typography>
            <Title variant="h1">
            Enhance your Recycling with Reyctrack.
            </Title>
            <Typography
              variant="body2"
              sx={{ fontSize: "18px", color: "#5A6473", my: 4 }}
            >
             Discover the best recycling opportunities with our comprehensive platform designed for sustainability enthusiasts!
            </Typography>
            <CustomButton
              backgroundColor="#0F1B4C"
              color="#fff"
              buttonText="More About Us"
              heroBtn={true}
            />
          </Box>

          <Box sx={{ flex: "1.25", display:"flex", justifyContent: 'center', alignItems: "center", mt: 6 }}>
            <img
              src={HeroImg}
              alt="heroImg"
              style={{ maxWidth: "80%", marginBottom: "2rem"}}
            />
          </Box>
        </CustomBox>
      </Container>
    </Box>
  </>;
};

const Navbar =() =>{
  const [mobileMenu, setMobileMenu] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.type === "Tab" || event.type === "Shift")
    ) {
      return;
    }

    setMobileMenu({ ...mobileMenu, [anchor]: open });
  };
  const navigate = useNavigate();

  const RegisterNavigationLink = () => {
    navigate("/register")
  }
  const LoginNavigationLink = () => {
    navigate("/login")
  }

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["Home", "Features", "Services", "About Us", "Contact"].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index === 0 && <HomeIcon />}
                  {index === 1 && <FeaturedPlayListIcon />}
                  {index === 2 && <MiscellaneousServicesIcon />}
                  {index === 3 && <ListAltIcon />}
                  {index === 4 && <ContactsIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  const NavLink = styled(Typography)(({ theme }) => ({
    fontSize: "14px",
    color: "#4F5361",
    fontWeight: "bold",
    cursor: "pointer",
    "&:hover": {
      color: "#fff",
    },
  }));

  const NavbarLinksBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  }));

  const CustomMenuIcon = styled(MenuIcon)(({ theme }) => ({
    cursor: "pointer",
    display: "none",
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  }));

  const NavbarContainer = styled(Container)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2),
    },
  }));

  const NavbarLogo = styled("img")(({ theme }) => ({
    cursor: "pointer",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  }));

  return (
    <NavbarContainer>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2.5rem",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CustomMenuIcon onClick={toggleDrawer("left", true)} />
          <Drawer
            anchor="left"
            open={mobileMenu["left"]}
            onClose={toggleDrawer("left", false)}
          >
            {list("left")}
          </Drawer>
          <NavbarLogo src={recycleLogo} alt="logo" width="40px"/>
        </Box>

        <NavbarLinksBox>
          <NavLink variant="body2">Home</NavLink>
          <NavLink variant="body2">Features</NavLink>
          <NavLink variant="body2">Services</NavLink>
          <NavLink variant="body2">About Us</NavLink>
          <NavLink variant="body2">Contact</NavLink>
        </NavbarLinksBox>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <NavLink variant="body2" onClick={RegisterNavigationLink}>Sign Up</NavLink>
         <NavLink variant="body2"  onClick={LoginNavigationLink}> <CustomButton
         
          backgroundColor="#0F1B4C"
          color="#fff"
          buttonText="Login"
        /></NavLink>
       
      </Box>
    </NavbarContainer>
  );
};

const CustomButton = ({backgroundColor, color, buttonText, heroBtn,guideBtn, getStartedBtn}) =>{
  const CustomButton = styled(Button)(({ theme }) => ({
   backgroundColor: backgroundColor,
   color:color,
   fontWeight:"700",
   fontSize: "14px",
   cursor: "pointer",
   padding: "0.5rem 1.25rem",
   borderRadius: "7px",
   textTransform: "none",
   display: "block",
   border: "2px solid transparent",
   "&:hover": {
    backgroundColor:color,
    color: backgroundColor,
    borderColor: backgroundColor
   },
   [theme.breakpoints.down("md")]: {
    margin: ( heroBtn|| getStartedBtn) && theme.spacing(0, "auto", 3, "auto"),
    width: (heroBtn || getStartedBtn) && "90%"
   },
   [theme.breakpoints.down("sm")]: {
    marginTop:guideBtn && theme.spacing(3),
    width: guideBtn && "90%"
   }
  }));

  return <CustomButton>{buttonText}</CustomButton>
}

export default Home;
