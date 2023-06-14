import React from "react";
import { Typography, Box, useTheme, useMediaQuery } from "@mui/material";

function Header({ title, subtitle }) {
  const theme = useTheme();
  
  const isNonMobile = useMediaQuery("(min-width: 942px)");

  return (
    <Box>
      <Typography
        variant={isNonMobile ? "h2": "h3"}
        color={theme.palette.secondary[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        color={theme.palette.secondary[300]}
    
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

export default Header;
