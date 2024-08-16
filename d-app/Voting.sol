// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingDApp {

    // Event structure acting as a proposal
    struct Event {
        uint id;
        string name;
        string description; // New attribute for event description
        uint totalVotes; // Total number of votes for the event
        bool active;
        uint[4] voteOptions; // Array to store votes for 4 different options
        mapping(address => bool) hasVoted;
        address organizer;
    }

    // Mapping to store all events
    mapping(uint => Event) public events;

    // Counter for event IDs
    uint public eventCount;

    // Internal function to create an event with predefined votes and description
    function createEventWithVotes(string memory _name, string memory _description, uint[4] memory _voteOptions) internal {
        eventCount++;
        Event storage newEvent = events[eventCount];
        newEvent.id = eventCount;
        newEvent.name = _name;
        newEvent.description = _description; // Setting the description
        newEvent.active = true;
        newEvent.organizer = msg.sender;
        newEvent.voteOptions = _voteOptions;
        newEvent.totalVotes = _voteOptions[0] + _voteOptions[1] + _voteOptions[2] + _voteOptions[3];
    }

    // Function to create a new event (anyone can create an event)
    function createEvent(string memory _name, string memory _description) public returns (uint) {
        eventCount++;
        Event storage newEvent = events[eventCount];
        newEvent.id = eventCount;
        newEvent.name = _name;
        newEvent.description = _description; // Setting the description
        newEvent.active = true;
        newEvent.organizer = msg.sender;

        return newEvent.id; // Return the new event ID
    }

    // Constructor to create 5 premade events with descriptions and random votes when the contract is deployed
    constructor() {
        createEventWithVotes("The Great Cookie Debate", "A heated debate over the best cookie.", [uint(1), uint(10), uint(3), uint(2)]);
        createEventWithVotes("Dance-Off at the Office", "A fun dance competition at work.", [uint(8), uint(1), uint(4), uint(0)]);
        createEventWithVotes("Battle of the Couch Potatoes", "Who's the ultimate couch potato?", [uint(2), uint(1), uint(9), uint(3)]);
        createEventWithVotes("Pajama Fashion Showdown", "Show off your best pajamas!", [uint(0), uint(1), uint(5), uint(8)]);
        createEventWithVotes("The Epic Paper Airplane Contest", "Who can fly the furthest?", [uint(4), uint(3), uint(2), uint(4)]);
    }

    // Function to vote for an event (anyone can vote)
    // _optionIndex should be between 0 and 3
    function vote(uint _eventId, uint _optionIndex) public {
        require(_optionIndex < 4, "Invalid option index.");
        Event storage eventInstance = events[_eventId];
        require(eventInstance.active, "Event is not active.");
        require(!eventInstance.hasVoted[msg.sender], "You have already voted.");

        eventInstance.voteOptions[_optionIndex]++;
        eventInstance.totalVotes++; // Increment the total vote count
        eventInstance.hasVoted[msg.sender] = true;
    }

    // Function to end voting and close the event (only the organizer can end their event)
    function endEvent(uint _eventId) public {
        Event storage eventInstance = events[_eventId];
        require(eventInstance.organizer == msg.sender, "Only the organizer can end this event.");
        eventInstance.active = false;
    }

    // Function to get the results of an event
  function getResults(uint _eventId) public view returns (string memory, string memory, uint[4] memory, uint) {
    Event storage eventInstance = events[_eventId];
    return (eventInstance.name, eventInstance.description, eventInstance.voteOptions, eventInstance.totalVotes);
}


    // Function to return details of all events
    function getAllEvents() public view returns (uint[] memory, string[] memory, string[] memory, uint[4][] memory, uint[] memory) {   
        uint[] memory ids = new uint[](eventCount);
        string[] memory names = new string[](eventCount);
        string[] memory descriptions = new string[](eventCount); // Array for descriptions
        uint[4][] memory voteOptions = new uint[4][](eventCount); // Array for vote options
        uint[] memory totalVotes = new uint[](eventCount);

        for (uint i = 1; i <= eventCount; i++) {
            Event storage eventInstance = events[i];
            ids[i-1] = eventInstance.id;
            names[i-1] = eventInstance.name;
            descriptions[i-1] = eventInstance.description; // Include description
            voteOptions[i-1] = eventInstance.voteOptions;
            totalVotes[i-1] = eventInstance.totalVotes;
        }

        return (ids, names, descriptions, voteOptions, totalVotes);
    }

    // Function to get the top 5 event IDs based on total votes
    function getTop5EventIds() public view returns (uint[] memory) {
      
        uint[] memory topIds = new uint[](eventCount);
        uint[] memory topTotalVotes = new uint[](eventCount);
        for (uint i = 1; i <= eventCount; i++) {
            Event storage eventInstance = events[i];
            uint currentVotes = eventInstance.totalVotes;

            // Insertion sort to find the correct place for the current event
            for (uint j = 0; j < 5; j++) {
                if (currentVotes > topTotalVotes[j]) {
                    // Make room for the new top event by shifting lesser events down
                    for (uint k = 4; k > j; k--) {
                        topIds[k] = topIds[k-1];
                        topTotalVotes[k] = topTotalVotes[k-1];
                    }
                    // Insert the current event into the top list
                    topIds[j] = eventInstance.id;
                    topTotalVotes[j] = currentVotes;
                    break;
                }
            }
        }

        return topIds;
    }

    // Function to get the most recent 5 event IDs
    function getRecentEvents() public view returns (uint[] memory) {
        uint count = eventCount < 5 ? eventCount : 5; // Determine how many events to return
        uint[] memory ids = new uint[](count);

        for (uint i = 0; i < count; i++) {
            ids[i] = events[eventCount - i].id; // Access the last events in reverse order
        }

        return ids;
    }

    // Function to get the last event ID
    function getLastEventId() public view returns (uint) {
        require(eventCount > 0, "No events have been created yet.");
        return eventCount;
    }

     // Function to get all events created by and participated in by the caller (msg.sender)
    function getUserEvents() public view returns (uint[] memory createdEventIds, uint[] memory participatedEventIds) {
        uint createdCount = 0;
        uint participatedCount = 0;

        // Count the number of events created and participated in by the caller
        for (uint i = 1; i <= eventCount; i++) {
            if (events[i].organizer == msg.sender) {
                createdCount++;
            }
            if (events[i].hasVoted[msg.sender]) {
                participatedCount++;
            }
        }

        // Initialize arrays to hold the event IDs
        createdEventIds = new uint[](createdCount);
        participatedEventIds = new uint[](participatedCount);

        uint createdIndex = 0;
        uint participatedIndex = 0;

        // Populate the arrays with event IDs
        for (uint i = 1; i <= eventCount; i++) {
            if (events[i].organizer == msg.sender) {
                createdEventIds[createdIndex] = events[i].id;
                createdIndex++;
            }
            if (events[i].hasVoted[msg.sender]) {
                participatedEventIds[participatedIndex] = events[i].id;
                participatedIndex++;
            }
        }

        return (createdEventIds, participatedEventIds);
    }
}






