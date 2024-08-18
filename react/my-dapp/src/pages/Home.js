import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const HeroSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '300px',
  backgroundColor: '#3f51b5',
  color: '#fff',
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: '#ff4081',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#f50057',
  },
}));

const AccountInfoBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  wordWrap: 'break-word',
  backgroundColor: theme.palette.background.default,
}));

const Home = ({ contract, account }) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const createEvent = async () => {
    if (contract && eventName && eventDescription) {
      try {
        const tx = await contract.createEvent(eventName, eventDescription);
        await tx.wait(); // Wait for transaction to be mined
        setSuccessMessage(`Event "${eventName}" created successfully!`);
        setEventName('');
        setEventDescription('');
      } catch (error) {
        console.error('Error creating event:', error);
        setErrorMessage('Failed to create event.');
      }
    } else {
      setErrorMessage('Please fill in all fields.');
    }
  };

  return (
    <Box mt={4}>
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to the Voting DApp
        </Typography>
        <Typography variant="h6" component="p">
          Create and manage your events seamlessly on the blockchain.
        </Typography>
      </HeroSection>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          {errorMessage && <Alert severity="error" style={{ marginBottom: '20px' }}>{errorMessage}</Alert>}
          {successMessage && <Alert severity="success" style={{ marginBottom: '20px' }}>{successMessage}</Alert>}
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
              Create a New Event
            </Typography>
            <TextField
              label="Event Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <TextField
              label="Event Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <StyledButton
              variant="contained"
              fullWidth
              size="large"
              startIcon={<AddCircleOutlineIcon />}
              onClick={createEvent}
              disabled={!account}
            >
              Create Event
            </StyledButton>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box style={{ textAlign: 'center', padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Account Info
            </Typography>
            {account ? (
              <AccountInfoBox elevation={3}>
                <Typography variant="body1">Connected account:</Typography>
                <Typography variant="body2" color="textSecondary">
                  {account}
                </Typography>
              </AccountInfoBox>
            ) : (
              <Alert severity="error">Please connect your MetaMask wallet.</Alert>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
