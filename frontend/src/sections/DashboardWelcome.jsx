import PropTypes from 'prop-types';
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  Typography
} from '@mui/material';

export const DashboardWelcome = (props) => {
  const {sx ,user} = props;

  const now = new Date();
const hour = now.getHours();
let greeting;
if (hour >= 5 && hour < 12) {
  greeting = "Welcome, Good morning";
} else if (hour >= 12 && hour < 18) {
  greeting = "Welcome, Good afternoon";
} else if (hour >= 18 && hour < 22) {
  greeting = "Welcome, Good evening";
} else {
  greeting = "Welcome";
}

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              gutterBottom
              variant="overline"
            >
              {greeting}
            </Typography>
            <Typography variant="h2"  sx={{fontWeight: 'bold'}}>
             {user.name.toUpperCase()}
            </Typography>
            <Typography variant="h6">
             How was your day?
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
            <Box
                component="img"
                alt="profile"
                src={user.picture.url}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
          </Avatar>
        </Stack>
       
      </CardContent>
    </Card>
  );
};

DashboardWelcome.propTypes = {
  value: PropTypes.number.isRequired,
  sx: PropTypes.object
};
