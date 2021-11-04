// SPDX-License-Identifier: GPL-3.0

// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

contract Election{


    
    address public owner;
    uint candidateCount;
    uint voterCount;
    bool start;
    bool end;
    Lead public the_one;

    

    // Constructor
    constructor(){
        owner = msg.sender;
        candidateCount = 0;
        voterCount = 0;
        start = false;
        end = false;
    }
    event Leader(uint256 highest_votes, string name);

    function getOwner() public view returns(address) {
        return owner;
    }

    // Only Admin can access
    modifier onlyAdmin() {
        require(msg.sender == owner);
        _;
    }

    struct Candidate{
        string name;
        string party;
        string manifesto;
        uint voteCount;
        uint schoolId;
        uint candidateId;
    }
    
    struct Lead{
        string  name;
        uint256 votes;
    }

    mapping(uint => Candidate) public candidateDetails;

    // Only admin can add candidate
    function addCandidate(string memory _name, string memory _party, string memory _manifesto, uint _schoolId) public onlyAdmin {
        Candidate memory newCandidate = Candidate({
           name : _name,
           party : _party,
           manifesto : _manifesto,
           voteCount : 0,
           schoolId : _schoolId,
           candidateId : candidateCount
        });

        candidateDetails[candidateCount] = newCandidate;
        candidateCount += 1;
    }

    // get total number of candidates
    function getCandidateNumber() public view returns (uint) {
        return candidateCount;
    }

    struct Voter{
        address voterAddress;
        string name;
        string voterId;
        uint schoolId;
        bool hasVoted;
        bool isVerified;
    }

    address[] public voters;
    mapping(address => Voter) public voterDetails;

    // request to be added as voter
    function requestVoter(string memory _name, string memory _voterId, uint _schoolId) public {
        Voter memory newVoter = Voter({ 
           voterAddress : msg.sender,
           name : _name,
           voterId : _voterId,
           schoolId : _schoolId,
           hasVoted : false,
           isVerified : false
        });

        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
        voterCount += 1;
    }

    // get total number of voters
    function getVoterCount() public view returns (uint) {
        return voterCount;
    }

    function verifyVoter(address _address) public onlyAdmin {
        voterDetails[_address].isVerified = true;
    }

    function vote(uint candidateId) public{
        require(voterDetails[msg.sender].hasVoted == false);
        require(voterDetails[msg.sender].isVerified == true);
        require(start == true);
        require(end == false);

        candidateDetails[candidateId].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
    }

    function startElection() public onlyAdmin {
        start = true;
        end = false;
    }

    function endElection() public onlyAdmin {
        end = true;
        start = false;
    }

    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }

    
    //declarations
    
    // FUNCTION TO FIND THE lead
    function leader() public{
        require(end==true);
        uint256 max_votes = 0;
        string memory name = "";
        for(uint256 i=0; i< candidateCount; i++){
            if(max_votes < candidateDetails[i].voteCount){
                max_votes = candidateDetails[i].voteCount;
                name = candidateDetails[i].name;
            }
        }
        the_one = Lead(name, max_votes);
        emit Leader(max_votes, name);
    }

}