import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const EventBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const MyEvents = ({ userEvents = [] }) => {
  return (
    <Box mt={4}>
      <Typography variant="h4" align="center" gutterBottom>
        My Events
      </Typography>
      {userEvents.length > 0 ? (
        userEvents.map((event, index) => (
          <EventBox elevation={3} key={index}>
            <Typography variant="h6">Event ID: {event.toString()}</Typography>
            <Link to={`/event/${event.toString()}`}>View Details</Link>
          </EventBox>
        ))
      ) : (
        <Typography variant="body1" align="center">
          No events found.
        </Typography>
      )}
    </Box>
  );
};

export default MyEvents;
