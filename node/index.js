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



const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			}
		],
		"name": "createEvent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
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
				"internalType": "uint256",
				"name": "_optionIndex",
				"type": "uint256"
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
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalVotes",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
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
		"inputs": [],
		"name": "getAllEvents",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "uint256[4][]",
				"name": "",
				"type": "uint256[4][]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLastEventId",
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
		"inputs": [],
		"name": "getRecentEvents",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
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
				"internalType": "uint256[4]",
				"name": "",
				"type": "uint256[4]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTop5EventIds",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUserEvents",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "createdEventIds",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "participatedEventIds",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
        
        
    
;

const contractAddress = '0x58225528f05AED3488f0f558b378469A05fa468b';
const contract = new web3.eth.Contract(contractABI, contractAddress);

const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);


// API endpoint to create an event
app.post('/createEvent', async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Invalid event name' });
        }
        if (!description || typeof description !== 'string') {
            return res.status(400).json({ error: 'Invalid event description' });
        }

        const data = contract.methods.createEvent(name, description).encodeABI();

        const gasEstimate = await web3.eth.estimateGas({
            from: account.address,
            to: contractAddress,
            data: data
        });

        const tx = {
            from: account.address,
            to: contractAddress,
            gas: gasEstimate,  // Using the estimated gas limit
            gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
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
            options: ["option1", "option2", "option3", "option4"],
            votes: result[1] // This is an array in the new Solidity contract
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to get all events
app.get('/getAllEvents', async (req, res) => {
    try {
        const events = await contract.methods.getAllEvents().call();

        // Log the events array for debugging
        console.log('Events data:', events);

      

        const ids = events[0].map(id => id.toString()); // Convert BigInt to string
        const names = events[1];
        const descriptions = events[2];
        const votesArray = events[3]; // Nested array for votes

        // Handle totalVotes array carefully, ensuring all elements are correctly converted
        const totalVotes = events[4].map(vote => vote.toString());

        let formattedEvents = [];

        for (let i = 0; i < ids.length; i++) {
            formattedEvents.push({
                id: ids[i],
                name: names[i],
                description: descriptions[i],
                options: ["option1", "option2", "option3", "option4"],
                votes: votesArray[i].map(vote => parseInt(vote.toString())), // Convert nested BigInt to integer
                totalVotes: totalVotes[i]
            });
        }

        // Apply filtering based on query parameters
        const query = req.query;

        if (query.id) {
            formattedEvents = formattedEvents.filter(event => event.id === query.id);
        }

        if (query.name) {
            formattedEvents = formattedEvents.filter(event => event.name.toLowerCase().includes(query.name.toLowerCase()));
        }

        res.status(200).json({ events: formattedEvents });
    } catch (error) {
        console.error('Error fetching all events:', error.message);
        res.status(500).json({ error: error.message });
    }
});



// API endpoint to get the last event ID
app.get('/getLastEventId', async (req, res) => {
    try {
        const eventId = await contract.methods.getLastEventId().call();
        res.status(200).json({ eventId: eventId.toString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to get recent events (last 5 events)
app.get('/getRecentEvents', async (req, res) => {
    try {
        const recentEventIds = await contract.methods.getRecentEvents().call();
        res.status(200).json({ recentEventIds: recentEventIds.map(id => id.toString()) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to get events created by and participated in by the caller (msg.sender)
app.get('/getUserEvents', async (req, res) => {
    try {
        const userAddress = req.query.address || account.address;
        const userEvents = await contract.methods.getUserEvents(userAddress).call();

        res.status(200).json({
            createdEvents: userEvents[0].map(id => id.toString()),  // Events created by user
            participatedEvents: userEvents[1].map(id => id.toString())  // Events user has voted in
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/getTop5EventIds', async (req, res) => {
    try {
        // Call the smart contract function to get the top 5 event IDs
        const topEventIds = await contract.methods.getTop5EventIds().call();

        // Convert the BigInt IDs to strings
        const formattedEventIds = topEventIds.map(id => id.toString());

        res.status(200).json({ topEventIds: formattedEventIds });
    } catch (error) {
        console.error('Error fetching top 5 event IDs:', error.message);
        res.status(500).json({ error: error.message });
    }
});


app.get('/eventCount', async (req, res) => {
    try {
        const eventCount = await contract.methods.eventCount().call();
        res.status(200).json({ eventCount: eventCount.toString() }); // Convert BigInt to string
    } catch (error) {
        console.error('Error fetching event count:', error.message);
        res.status(500).json({ error: error.message });
    }
});


app.post('/createEvent', async (req, res) => {
    try {
        console.log('Request received:', req.body);
        const { name, description } = req.body;

        if (!name || typeof name !== 'string') {
            console.error('Invalid event name provided:', name);
            return res.status(400).json({ error: 'Invalid event name' });
        }

        if (!description || typeof description !== 'string') {
            console.error('Invalid event description provided:', description);
            return res.status(400).json({ error: 'Invalid event description' });
        }

        console.log('Input validated. Name:', name, 'Description:', description);

        const data = contract.methods.createEvent(name, description).encodeABI();
        console.log('Encoded contract data:', data);

		const gasEstimate = await web3.eth.estimateGas({
            from: account.address,
            to: contractAddress,
            data: data
        });

        const tx = {
            from: account.address,
            to: contractAddress,
            gas: gasEstimate,
            gasPrice: 2333333333,
            data: data
        };

        console.log('Transaction object created:', tx);

        const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
        console.log('Transaction signed successfully');

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('Transaction sent successfully. Receipt:', receipt);
        res.status(200).json({ receipt });
    } catch (error) {
        console.error('Unexpected error occurred:', error.message);
        res.status(500).json({
            error: error.message,
            details: error.stack,
        });
    }
});


// API endpoint to vote on an event
app.post('/vote', async (req, res) => {
    try {
        const { eventId, optionIndex } = req.body;
        if (!eventId || isNaN(optionIndex) || optionIndex < 0 || optionIndex > 3) {
            return res.status(400).json({ error: 'Invalid event ID or option index' });
        }

        const data = contract.methods.vote(eventId, optionIndex).encodeABI();

        const gasEstimate = await web3.eth.estimateGas({
            from: account.address,
            to: contractAddress,
            data: data
        });

        const tx = {
            from: account.address,
            to: contractAddress,
            gas: gasEstimate,
            gasPrice: 2333333333,
            data: data
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        res.status(200).json({ receipt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




