import React from 'react'
import { Box, useTheme } from '@mui/material'

const WelcomeUser = ({ user }) => {
    const theme = useTheme();
    console.log(user);
  return (
    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh', flexDirection: 'column'}}>
    
        <h3>HI, <span style={{color: theme.palette.primary.main}}>{user.name.toUpperCase()}</span>.</h3>
        <Box
                component="img"
                alt="profile"
                src={user.picture.url}
                height="64px"
                width="64px"
                borderRadius="20%"
                sx={{ objectFit: "cover" }}
              />
               </Box>
  )
}

export default WelcomeUser