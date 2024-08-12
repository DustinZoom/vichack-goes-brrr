// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingDApp {
    // Define roles
    enum Role { None, Voter, Organizer }

    // Store the role of each user
    mapping(address => Role) public roles;

    // Event structure acting as a proposal
    struct Event {
        uint id;
        string name;
        bool active;
        uint yesVotes;
        uint noVotes;
        mapping(address => bool) hasVoted;
        address organizer;
    }

    // Mapping to store all events
    mapping(uint => Event) public events;

    // Counter for event IDs
    uint public eventCount;

    // Modifier to restrict functions to only organizers
    modifier onlyOrganizer() {
        require(roles[msg.sender] == Role.Organizer, "You are not an organizer.");
        _;
    }

    // Modifier to restrict functions to only voters
    modifier onlyVoter() {
        require(roles[msg.sender] == Role.Voter, "You are not a voter.");
        _;
    }

    // Constructor to assign the deployer as an organizer
    constructor() {
        roles[msg.sender] = Role.Organizer;
    }

    // Function to assign roles
    function assignRole(address _user, Role _role) public onlyOrganizer {
        require(roles[_user] == Role.None, "User already has a role.");
        roles[_user] = _role;
    }

    // Function to create a new event (only for organizers)
    function createEvent(string memory _name) public onlyOrganizer {
        eventCount++;
        Event storage newEvent = events[eventCount];
        newEvent.id = eventCount;
        newEvent.name = _name;
        newEvent.active = true;
        newEvent.organizer = msg.sender;
    }

    // Function to vote for an event
    function vote(uint _eventId, bool _voteYes) public onlyVoter {
        Event storage eventInstance = events[_eventId];
        require(eventInstance.active, "Event is not active.");
        require(!eventInstance.hasVoted[msg.sender], "You have already voted.");

        if (_voteYes) {
            eventInstance.yesVotes++;
        } else {
            eventInstance.noVotes++;
        }
        eventInstance.hasVoted[msg.sender] = true;
    }

    // Function to end voting and close the event (only for organizers)
    function endEvent(uint _eventId) public onlyOrganizer {
        Event storage eventInstance = events[_eventId];
        require(eventInstance.organizer == msg.sender, "Only the organizer can end this event.");
        eventInstance.active = false;
    }

    // Function to get the results of an event
    function getResults(uint _eventId) public view returns (string memory, uint, uint) {
        Event storage eventInstance = events[_eventId];
        require(!eventInstance.active, "Event is still active.");
        return (eventInstance.name, eventInstance.yesVotes, eventInstance.noVotes);
    }
}
