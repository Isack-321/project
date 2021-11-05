import React, { Component } from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import { FormGroup, FormControl,Button } from 'react-bootstrap';

class Result extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Election: undefined,
      account: null,
      web3: null,
      toggle:false,
      result:null,
      isOwner:false,
      candidateList:null,
      start:false,
      end:false
    }
  }

  updateschoolId = event => {
    this.setState({schoolId : event.target.value});
  }

  result = async () => {

    let result = [];
    let max=0;
    let candidateList=[];

    let candidateCount = await this.state.Election.methods.getCandidateNumber().call();
    for(let i=0;i<candidateCount;i++){
        let candidate = await this.state.Election.methods.candidateDetails(i).call();

        if(this.state.schoolId === candidate.schoolId){
          candidateList.push(candidate);
            if(candidate.voteCount === max){
                result.push(candidate);
            }else if(candidate.voteCount > max){
                result = [];
                result.push(candidate);
                max = candidate.voteCount;
            }
        }
    }

    this.setState({result : result});
    this.setState({toggle : true})
    this.setState({candidateList : candidateList});

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

      const owner = await this.state.Election.methods.getOwner().call();
      if(this.state.account === owner){
        this.setState({isOwner : true});
      }

      let start = await this.state.Election.methods.getStart().call();
      let end = await this.state.Election.methods.getEnd().call();

      this.setState({start : start, end : end });
      
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
    if(this.state.result){
        if(this.state.result){
          candidateList = this.state.result.map((candidate) => {
            return (
              <div className="candidate">
                <div className="candidateName">{candidate.name} : {candidate.voteCount} Votes</div>
                <div className="candidateDetails">
                  <div>Party : {candidate.party}</div>
                  <div>Manifesto : {candidate.manifesto}</div>
                  <div>SchoolId : {candidate.schoolId}</div>
                  <div>Candidate ID : {candidate.candidateId}</div>
                </div>
              </div>
            );
          });
        }
    }

    let candidateList2;
    if(this.state.candidateList){
        if(this.state.candidateList){
          candidateList2 = this.state.candidateList.map((candidate) => {
            return (
              <div className="candidate">
                <div className="candidateName">{candidate.name} : {candidate.voteCount} Votes</div>
                <div className="candidateDetails">
                  <div>Party : {candidate.party}</div>
                  <div>Manifesto : {candidate.manifesto}</div>
                  <div>schoolId : {candidate.schoolId}</div>
                  <div>Candidate ID : {candidate.candidateId}</div>
                </div>
              </div>
            );
          });
        }
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

    if(!this.state.isOwner){
        return(
          <div className="CandidateDetails">
            <div className="CandidateDetails-title">
              <h1>
                ONLY ADMIN CAN ACCESS
              </h1>
            </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          </div>
        );
    }

    if(!this.state.end){
      return(
        <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
          END THE VOTING....TO SEE RESULTS
          </h1>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
      </div>
      );
    }

    return (
      <div className="App">
        {/* <div>{this.state.owner}</div> */}
        {/* <p>Account address - {this.state.account}</p> */}
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              RESULTS
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}


        <div className="form">
          <FormGroup>
            <div className="form-label">Enter schoolId for results - </div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.schoolId}
                  onChange={this.updateschoolId}
              />
            </div>
            <Button onClick={this.result} className="button-vote">
              Result
            </Button>
          </FormGroup>
        </div>
        

        <br></br>

        {this.state.toggle ? 
          <div>
            <div className="CandidateDetails-mid-sub-title">
              Leaders -
            </div>
            {candidateList}
            <div className="CandidateDetails-mid-sub-title">
              schoolId Votes -
            </div>
            {candidateList2}
          </div>

          
          : ''}


      </div>
    );
  }
}

export default Result;
