import React, { Component } from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";

import { FormGroup, FormControl,Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

class Vote extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Election: undefined,
      account: null,
      web3: null,
      candidateList: null,
      candidateId:'',
      toggle:false,
      myAccount:null,
      candidateschoolIdList:null,
      start:false,
      end:false,
      isOwner:false
    }
  }

  updateCandidateId = event => {
    this.setState({candidateId : event.target.value});
  }

  vote = async () => {
    let candidate = await this.state.Election.methods.candidateDetails(this.state.candidateId).call();
    // await this.state.MasoomInstance.methods.addCandidate(this.state.name, this.state.party, this.state.manifesto, this.state.constituency).send({from : this.state.account , gas: 1000000});

    if(this.state.myAccount.schoolId !== candidate.schoolId){
      this.setState({toggle : true});
    }else{
      await this.state.Election.methods.vote(this.state.candidateId).send({from : this.state.account , gas: 1000000});
      this.setState({toggle : false});
      // Reload
    window.location.reload(false);
    }
  }

  componentDidMount = async () => {
    // FOR REFRESHING PAGE ONLY ONCE -
    if(!window.location.hash){
      window.location = window.location + '#loaded';
      window.location.reload();
    }
    
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      this.setState({ Election: instance, web3: web3, account: accounts[0] });

      let myAccount = await this.state.Election.methods.voterDetails(this.state.account).call();
      this.setState({myAccount : myAccount});


      let candidateCount = await this.state.Election.methods.getCandidateNumber().call();

      let candidateList = [];
      for(let i=0;i<candidateCount;i++){
        let candidate = await this.state.Election.methods.candidateDetails(i).call();
        if(myAccount.schoolId === candidate.schoolId){
          candidateList.push(candidate);
        }
      }
      this.setState({candidateConstituencyList : candidateList});

      let start = await this.state.Election.methods.getStart().call();
      let end = await this.state.Election.methods.getEnd().call();

      this.setState({start : start, end : end });

      const owner = await this.state.Election.methods.getOwner().call();
      if(this.state.account === owner){
        this.setState({isOwner : true});
      }
      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {

    let candidateList;
    if(this.state.candidateschoolIdList){
      candidateList = this.state.candidateschoolIdList.map((candidate) => {
        return (
          <div className="candidate">
          <div className="candidateName">{candidate.name}</div>
          <div className="candidateDetails">
            <div>Party : {candidate.party}</div>
            <div>Manifesto : {candidate.manifesto}</div>
            <div>SchoolId: {candidate.schoolId}</div>
            <div>Candidate ID : {candidate.candidateId}</div>
          </div>
        </div>
        );
      });
    }

    if (!this.state.web3) {
      return (
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
            Loading Web3, accounts, and contract..
            </h1>
          </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
        
      );
    }

    if(this.state.end){
      return(
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              VOTING HAS ENDED
            </h1>
          </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }

    if(!this.state.start){
      return(
        <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
          VOTING HAS NOT STARTED YET.
          </h1>
        </div>

        <div className="CandidateDetails-sub-title">
        Please Wait.....While election starts !
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }

    if(this.state.myAccount){
      if(!this.state.myAccount.isVerified){
        return(
          <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
            You need to verified first for voting.
            </h1>
          </div>

          <div className="CandidateDetails-sub-title">
          Please wait....the verification can take time
          </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          </div>
        );
      }
    }

    if(this.state.myAccount){
      if(this.state.myAccount.hasVoted){
        return(
          <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              YOU HAVE SUCCESSFULLY CASTED YOUR VOTE
            </h1>
          </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
        );
      }
    }

    return (
      <div className="App">
        {/* <div>{this.state.owner}</div> */}
        {/* <p>Account address - {this.state.account}</p> */}
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              VOTE
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="form">
          <FormGroup>
            <div className="form-label">Enter Candidate ID you want to vote - </div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.candidateId}
                  onChange={this.updateCandidateId}
              />
            </div>

            <Button onClick={this.vote} className="button-vote">
              Vote
            </Button>
          </FormGroup>
        </div>

        {/* <Button onClick={this.getCandidates}>
          Get Name
        </Button> */}

        {this.state.toggle ? <div>You can only vote to your own school</div> : ''}

        <div className="CandidateDetails-mid-sub-title">
          Candidates from your school
        </div>

        <div>
          {candidateList}
        </div>

      </div>
    );
  }
}

export default Vote;
