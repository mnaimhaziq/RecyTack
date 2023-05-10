import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Link, } from 'react-router-dom';


export const DashboardLatestHistory = (props) => {
  const {  recyclingHistoriesTop8, sx } = props;


  return (
    <Card sx={sx}>
      <CardHeader title="Latest Recycling History" />
      
        <Box  sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Recycling Method
                </TableCell>
                <TableCell>
                  Waste Type
                </TableCell>
                <TableCell sortDirection="desc">
                  Quantity (KG)
                </TableCell>
                <TableCell>
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { recyclingHistoriesTop8.map((recyclingHistory) => {
                
                return (
                  <TableRow
                    hover
                    key={recyclingHistory._id}
                  >
                    <TableCell>
                      {recyclingHistory.recyclingMethod}
                    </TableCell>
                    <TableCell>
                      {recyclingHistory.wasteType}
                    </TableCell>
                    <TableCell>
                    {recyclingHistory.quantity}
                    </TableCell>
                    <TableCell> 
                    {new Date(recyclingHistory.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Link to="/recyclinghistory">
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
        >
          View all
        </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

DashboardLatestHistory.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
