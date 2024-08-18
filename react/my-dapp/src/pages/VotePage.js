import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';

const VotePage = ({ contract }) => {
  const [eventId, setEventId] = useState(''); // State to hold the event ID input by the user
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const voteOnEvent = async (optionIndex) => {
    if (!contract) {
      setErrorMessage("Smart contract not connected.");
      return;
    }
    if (!eventId) {
      setErrorMessage("Please enter a valid event ID.");
      return;
    }

    try {
      const tx = await contract.vote(parseInt(eventId), optionIndex);
      await tx.wait();
      setSuccessMessage(`Successfully voted for option ${optionIndex + 1} on event ID ${eventId}.`);
      setEventId(''); // Optionally clear the event ID input after successful voting
    } catch (error) {
      console.error('Error while voting:', error);
      setErrorMessage('Failed to submit vote.');
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4">Vote on Event</Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <TextField
        label="Event ID"
        variant="outlined"
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Button onClick={() => voteOnEvent(0)} variant="contained" color="primary">Vote Option 1</Button>
      <Button onClick={() => voteOnEvent(1)} variant="contained" color="primary">Vote Option 2</Button>
      <Button onClick={() => voteOnEvent(2)} variant="contained" color="primary">Vote Option 3</Button>
      <Button onClick={() => voteOnEvent(3)} variant="contained" color="primary">Vote Option 4</Button>
    </Box>
  );
};

export default VotePage;
