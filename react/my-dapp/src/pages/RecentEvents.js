import React, { useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
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

const RecentEvents = ({ contract }) => {
  const [recentEvents, setRecentEvents] = React.useState([]);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      if (contract) {
        try {
          const recentEventsData = await contract.getRecentEvents();
          setRecentEvents(recentEventsData);
        } catch (error) {
          console.error('Error fetching recent events:', error);
        }
      }
    };

    fetchRecentEvents();
  }, [contract]);

  return (
    <Box mt={4}>
      <Typography variant="h4" align="center" gutterBottom>
        Recent Events
      </Typography>
      {recentEvents.length > 0 ? (
        <Grid container spacing={2}>
          {recentEvents.map((eventId, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <EventBox elevation={3}>
                <Typography variant="h6">Event ID: {eventId.toString()}</Typography>
              </EventBox>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" align="center">
          No recent events found.
        </Typography>
      )}
    </Box>
  );
};

export default RecentEvents;
