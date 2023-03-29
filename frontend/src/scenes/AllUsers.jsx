import React, {useState, useEffect} from 'react'
import { Box, Card, CardActions, CardContent, Collapse, Button, Typography, Rating, useTheme, useMediaQuery, IconButton, InputBase} from '@mui/material'

import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../features/auth/authSlice'
import Users from '../components/Users'

import { Row, Col } from "react-bootstrap";
import FlexBetween from '../components/FlexBetween'
import { Search } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'

function AllUsers() {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const AllUsers = useSelector((state) => state.auth.AllUsers);


  useEffect(() => {
    dispatch(getAllUsers(user.token))
  },[dispatch])

  const submitHandler = (e) => {
    e.preventDefault()
    if(keyword.trim()){
      navigate(`/search/${keyword}`)
  }else{
      navigate('/')
  }
  } 
  return (
    <Box m="1.5rem 2.5rem">
        <Header title="Search" subtitle="Find your Family Members" />
        <FlexBetween>
          <FlexBetween
            backgroundColor={theme.palette.background.alt}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          >
            <form onSubmit={submitHandler}>
            <InputBase placeholder="Search..." onChange={(e) => setKeyword(e.target.value)}/>
            <IconButton type="submit">
              <Search />
            </IconButton>
            </form>
           
          </FlexBetween>
        </FlexBetween>
        <Row>{AllUsers.map((user) => (
          <Col key={user._id} sm={12} md={6} lg={4} xl={3}>
          <Users user={user} />
        </Col>
        ))}
        </Row>
    </Box>
  )
}

export default AllUsers