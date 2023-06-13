import React, {useState, useEffect} from 'react'
import { Box, Card, CardActions, CardContent, Collapse, Button, Typography, Rating, useTheme, useMediaQuery, IconButton, InputBase, Pagination, TextField} from '@mui/material'

import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../features/auth/authSlice'
import Users from '../components/Users'

import { Row, Col } from "react-bootstrap";
import FlexBetween from '../components/FlexBetween'
import { Search } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'

function AllUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [keyword, setKeyword] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const AllUsers = useSelector((state) => state.auth.AllUsers);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  useEffect(() => {
    dispatch(getAllUsers({token: user.token, page, search}))
    setTotalPages(AllUsers.pages)
  },[dispatch, user.token, page, AllUsers.pages, search])

 
   
  return (
    <Box m="1.5rem 2.5rem">
       <Box
        display={isNonMobile ? "flex" : "block"}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          m: "2rem 2rem 3rem"
        }}
      >
        <Header title="Manage Users" />

        <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
            id="search"
            label="Search By User Name"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearchChange}
          />
          
        </Box>
      </Box>
       
        <Row>{AllUsers.data && AllUsers.data.map((user) => (
          <Col key={user._id} sm={12} md={4} lg={3}>
          <Users user={user}  />
        </Col>
        ))}
        </Row>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            sx={{
              m: "2rem 0",
              "& .Mui-selected": { backgroundColor: "rgba(13,110,253,0.4) !important" },
            }}
            count={totalPages}
            page={page}
            variant="outlined"
            onChange={handlePageChange}
            siblingCount={1}
            showFirstButton
            showLastButton
          />
        </Box>
        
    </Box>
  )
}

export default AllUsers