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
        uint vote1; // Votes for option 1
        uint vote2; // Votes for option 2
        uint vote3; // Votes for option 3
        uint vote4; // Votes for option 4
        mapping(address => bool) hasVoted;
        address organizer;
    }

    // Mapping to store all events
    mapping(uint => Event) public events;

    // Counter for event IDs
    uint public eventCount;

     // Internal function to create an event with predefined votes and description
    function createEventWithVotes(string memory _name, string memory _description, uint _vote1, uint _vote2, uint _vote3, uint _vote4) internal {
        eventCount++;
        Event storage newEvent = events[eventCount];
        newEvent.id = eventCount;
        newEvent.name = _name;
        newEvent.description = _description; // Setting the description
        newEvent.active = true;
        newEvent.organizer = msg.sender;
        newEvent.vote1 = _vote1;
        newEvent.vote2 = _vote2;
        newEvent.vote3 = _vote3;
        newEvent.vote4 = _vote4;
        newEvent.totalVotes = _vote1 + _vote2 + _vote3 + _vote4;
    }

    // Function to create a new event (anyone can create an event)
    function createEvent(string memory _name, string memory _description) public {
        eventCount++;
        Event storage newEvent = events[eventCount];
        newEvent.id = eventCount;
        newEvent.name = _name;
        newEvent.description = _description; // Setting the description
        newEvent.active = true;
        newEvent.organizer = msg.sender;
    }


   // Constructor to create 5 premade events with descriptions and random votes when the contract is deployed
    constructor() {
        createEventWithVotes("The Great Cookie Debate", "A heated debate over the best cookie.", 1, 10, 3, 2);
        createEventWithVotes("Dance-Off at the Office", "A fun dance competition at work.", 8, 1, 4, 0);
        createEventWithVotes("Battle of the Couch Potatoes", "Who's the ultimate couch potato?", 2, 1, 9, 3);
        createEventWithVotes("Pajama Fashion Showdown", "Show off your best pajamas!", 0, 1, 5, 8);
        createEventWithVotes("The Epic Paper Airplane Contest", "Who can fly the furthest?", 4, 3, 2, 4);
    }
    

    // Function to vote for an event (anyone can vote)
    // _optionIndex should be between 0 and 3
    function vote(uint _eventId, uint _optionIndex) public {
        require(_optionIndex < 4, "Invalid option index.");
        Event storage eventInstance = events[_eventId];
        require(eventInstance.active, "Event is not active.");
        require(!eventInstance.hasVoted[msg.sender], "You have already voted.");

        if (_optionIndex == 0) {
            eventInstance.vote1++;
        } else if (_optionIndex == 1) {
            eventInstance.vote2++;
        } else if (_optionIndex == 2) {
            eventInstance.vote3++;
        } else if (_optionIndex == 3) {
            eventInstance.vote4++;
        }

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
    function getResults(uint _eventId) public view returns (string memory, uint, uint, uint, uint) {
        Event storage eventInstance = events[_eventId];
        return (eventInstance.name, eventInstance.vote1, eventInstance.vote2, eventInstance.vote3, eventInstance.vote4);
    }

    // Function to return details of all events
function getAllEvents() public view returns (uint[] memory, string[] memory, string[] memory, uint[] memory, uint[] memory, uint[] memory, uint[] memory, uint[] memory) {   
    uint[] memory ids = new uint[](eventCount);
    string[] memory names = new string[](eventCount);
    string[] memory descriptions = new string[](eventCount); // Array for descriptions
    uint[] memory vote1s = new uint[](eventCount);
    uint[] memory vote2s = new uint[](eventCount);
    uint[] memory vote3s = new uint[](eventCount);
    uint[] memory vote4s = new uint[](eventCount);
    uint[] memory totalVotes = new uint[](eventCount);

    for (uint i = 1; i <= eventCount; i++) {
        Event storage eventInstance = events[i];
        ids[i-1] = eventInstance.id;
        names[i-1] = eventInstance.name;
        descriptions[i-1] = eventInstance.description; // Include description
        vote1s[i-1] = eventInstance.vote1;
        vote2s[i-1] = eventInstance.vote2;
        vote3s[i-1] = eventInstance.vote3;
        vote4s[i-1] = eventInstance.vote4;
        totalVotes[i-1] = eventInstance.totalVotes;
    }

    return (ids, names, descriptions, vote1s, vote2s, vote3s, vote4s, totalVotes);
}





function getTop5EventIds() public view returns (uint[] memory) {
   
    uint[] memory topTotalVotes = new uint[](eventCount);
    uint[] memory topIds = new uint[](eventCount);


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







}
