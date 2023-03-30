
import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Box } from "@mui/material";
import Header from "../components/Header";

function createData(recycleDate, weight, material, recyclingPlace) {
    return { recycleDate, weight, material, recyclingPlace };
  }
  
  const rows = [
    createData('2022-03-01', 0.8, 'Paper', 'Kuala Lumpur Recycling Center'),
    createData('2022-03-03', 1.2, 'Plastic', 'Penang Recycling Center'),
    createData('2022-03-05', 1.5, 'Glass', 'Johor Bahru Recycling Center'),
    createData('2022-03-08', 2.0, 'Metal', 'Malacca Recycling Center'),
    createData('2022-03-10', 1.3, 'Paper', 'Ipoh Recycling Center'),
    createData('2022-03-12', 0.9, 'Plastic', 'Kuala Lumpur Recycling Center'),
    createData('2022-03-15', 1.7, 'Glass', 'Penang Recycling Center'),
    createData('2022-03-17', 2.2, 'Metal', 'Johor Bahru Recycling Center'),
    createData('2022-03-20', 1.4, 'Paper', 'Malacca Recycling Center'),
    createData('2022-03-22', 1.1, 'Plastic', 'Ipoh Recycling Center'),
  ];

const RecyclingHistory = () => {
  return (
    <Box m="1.5rem 2.5rem">
    <Header title="RECYCLING HISTORY" />
    <div style={{ margin:"3rem", height: "100%"}}> <TableContainer component={Paper}>
       
    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell align="right">weight&nbsp;(kg)</TableCell>
          <TableCell align="right">Material</TableCell>
          <TableCell align="right">Recycling Location</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.name}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.recycleDate}
            </TableCell>
            <TableCell align="right">{row.weight}</TableCell>
            <TableCell align="right">{row.material}</TableCell>
            <TableCell align="right">{row.recyclingPlace}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer></div>
  </Box>
  )
}

export default RecyclingHistory
