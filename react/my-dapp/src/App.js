import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Container, TextField, Button, Typography, Alert, Card, CardContent } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import ContractABI from './ContractABI.json';
import Home from './pages/Home';
import MyEvents from './pages/MyEvents';
import RecentEvents from './pages/RecentEvents';
import EventDetails from './pages/EventDetails';
import VotePage from './pages/VotePage';

const contractAddress = "0x64C2E71523a05ED8e7d3257cc51C86FE69dB940B";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          const contract = new ethers.Contract(contractAddress, ContractABI, signer);
          setContract(contract);
        } catch (error) {
          console.error("Error connecting to wallet:", error);
          setErrorMessage("Failed to connect to wallet.");
        }
      } else {
        setErrorMessage("Please install MetaMask to use this DApp.");
      }
    }
    connectWallet();
  }, []);

  return (
    <Router>
      <Container maxWidth="sm" style={{ marginTop: '50px' }}>
        <Typography variant="h4" align="center" gutterBottom>My Voting DApp</Typography>
        {account ? (
          <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
            Connected account: {account}
          </Typography>
        ) : (
          <Alert severity="error">Please connect your MetaMask wallet.</Alert>
        )}
        <nav>
          <Link to="/">Home</Link> | <Link to="/recent-events">Recent Events</Link>  | <Link to="/vote">Vote Now</Link> | <Link to="/event-details">Event Search</Link>

        </nav>
        <Routes>
          <Route path="/" element={<Home contract={contract} account={account} />} />
          <Route path="/recent-events" element={<RecentEvents contract={contract} />} />
          <Route path="/my-events" element={<MyEvents contract={contract} account={account} />} />
          <Route path="/event-details" element={<EventDetails contract={contract} />} />
          <Route path="/vote" element={<VotePage contract={contract} />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
