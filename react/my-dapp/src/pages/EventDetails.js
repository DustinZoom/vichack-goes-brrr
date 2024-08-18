import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BigNumber } from 'ethers';

const BackgroundBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  color: '#fff',
}));

const EventBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const EventDetails = ({ contract }) => {
  const [eventId, setEventId] = useState('');
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setEventId(e.target.value);
  };

  const fetchEventDetails = async () => {
    if (contract && eventId) {
      console.log('Fetching details for Event ID:', eventId); // Log event ID
      try {
        const [name, description, voteOptions, totalVotes] = await contract.getResults(eventId);

        console.log('Raw data returned from contract:', { name, description, voteOptions, totalVotes }); // Log raw data

        // Convert BigNumber to a regular number or string
        const formattedVoteOptions = voteOptions.map(vote => BigNumber.from(vote).toString());
        const formattedTotalVotes = BigNumber.from(totalVotes).toString();

        setEventDetails({
          name,
          description, // Directly use the description string
          voteOptions: formattedVoteOptions,
          totalVotes: formattedTotalVotes,
        });
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to fetch event details. Please make sure the event ID is correct.');
      }
    } else {
      console.warn('Contract not initialized or eventId is missing'); // Log when contract or event ID is missing
    }
  };

  return (
    <BackgroundBox>
      <Box display="flex" justifyContent="center" mb={4}>
        <TextField
          label="Enter Event ID"
          variant="outlined"
          value={eventId}
          onChange={handleInputChange}
          fullWidth
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={fetchEventDetails}
          sx={{ marginLeft: 2 }}
          disabled={!eventId}
        >
          Fetch Details
        </Button>
      </Box>
      {error && (
        <Typography variant="body1" align="center" color="error">
          {error}
        </Typography>
      )}
      {eventDetails ? (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            {eventDetails.name || 'N/A'}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            {eventDetails.description || 'No description available'}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Total Votes: {eventDetails.totalVotes || '0'}
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {eventDetails.voteOptions.map((vote, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <EventBox elevation={3}>
                  <Typography variant="h6" align="center">
                    Option {index + 1}
                  </Typography>
                  <Typography variant="h5" align="center">
                    {vote} votes
                  </Typography>
                </EventBox>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Typography variant="body1" align="center">
          Enter an Event ID to view details.
        </Typography>
      )}
    </BackgroundBox>
  );
};

export default EventDetails;
