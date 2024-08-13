require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Web3 } = require('web3');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use the chosen RPC URL for Polygon zkEVM testnet
const privateKey = '0x53075bf0d39363afb7fc7527a424202741f0752433b2c9f132f0c3abff5782f9';
const web3 = new Web3('https://polygon-zkevm-cardona.blockpi.network/v1/rpc/public');



const contractABI = 
    [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                },
                {
                    "internalType": "enum VotingDApp.Role",
                    "name": "_role",
                    "type": "uint8"
                }
            ],
            "name": "assignRole",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                }
            ],
            "name": "createEvent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_eventId",
                    "type": "uint256"
                }
            ],
            "name": "endEvent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_eventId",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "_voteYes",
                    "type": "bool"
                }
            ],
            "name": "vote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "eventCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "events",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "active",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "yesVotes",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "noVotes",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "organizer",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_eventId",
                    "type": "uint256"
                }
            ],
            "name": "getResults",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "roles",
            "outputs": [
                {
                    "internalType": "enum VotingDApp.Role",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
;

const contractAddress = '0xDE87423086a7925532ade978a51849ACE48F3063';
const contract = new web3.eth.Contract(contractABI, contractAddress);

const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

// API endpoint to assign a role
app.post('/assignRole', async (req, res) => {
    try {
        const { userAddress, role } = req.body;
        const data = contract.methods.assignRole(userAddress, role).encodeABI();

        const tx = {
            from: account.address,
            to: contractAddress,
            gas: 2000000,
            data: data
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        res.status(200).json({ receipt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to create an event
app.post('/createEvent', async (req, res) => {
    try {
        const { name } = req.body;
if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid event name' });
}
        const data = contract.methods.createEvent(name).encodeABI();

        const tx = {
            from: account.address,
            to: contractAddress,
            gas: 1500000, // Try a smaller gas limit
            gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')), // Explicitly set gas price
            data: data
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        res.status(200).json({ receipt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to vote on an event
app.post('/vote', async (req, res) => {
    try {
        const { eventId, voteYes } = req.body;
        const data = contract.methods.vote(eventId, voteYes).encodeABI();

        const tx = {
            from: account.address,
            to: contractAddress,
            gas: 2000000,
            data: data
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        res.status(200).json({ receipt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to get results of an event
app.get('/getResults/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const result = await contract.methods.getResults(eventId).call();
        res.status(200).json({
            name: result[0],
            yesVotes: result[1].toString(), // Convert BigInt to string
            noVotes: result[2].toString()   // Convert BigInt to string
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
