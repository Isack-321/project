import React, { Component } from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import { FormGroup, FormControl,Button } from 'react-bootstrap';

class RequestVoter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Election: undefined,
      account: null,
      web3: null,
      name:'',
      vaterId:'',
      schoolId:'',
      candidates: null,
      registered: false,
      isOwner:false
    }
  }

  updateName = event => {
    this.setState({ name : event.target.value});
  }

  updatevoterId = event => {
    this.setState({voterId : event.target.value});
  }

  updateschoolId = event => {
    this.setState({schoolId : event.target.value});
  }

  addVoter = async () => {
    await this.state.Election.methods.requestVoter(this.state.name, this.state.voterId, this.state.schoolId).send({from : this.state.account , gas: 1000000});
    // Reload
    window.location.reload(false);
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

      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ Election: instance, web3: web3, account: accounts[0] });

      let voterCount = await this.state.Election.methods.getVoterCount().call();

      let registered;
      for(let i=0;i<voterCount;i++){
          let voterAddress = await this.state.Election.methods.voters(i).call();
          if(voterAddress === this.state.account){
            registered = true;
            break;
          }
      }

      this.setState({ registered : registered});

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

    if(this.state.registered){
      return(
        <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
          ALREADY REGISTERED...WAIT FOR VERIFICATION 
          </h1>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
      </div>
      );
    }
    return (
      <div className="App">
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              VOTER FORM
            </h1>
          </div>
        </div>

        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="form">
        <FormGroup>
            <div className="form-label">Enter Name - </div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.name}
                  onChange={this.updateName}
              />
            </div>
        </FormGroup>

        <FormGroup>
            <div className="form-label">Enter Reg No - </div>
            <div className="form-input">
              <FormControl
                  input = 'textArea'
                  value = {this.state.voterId}
                  onChange={this.updatevoterId}
              />
            </div>
        </FormGroup>

        <FormGroup>
            <div className="form-label">Enter SchoolCode  </div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.schoolId}
                  onChange={this.updateschoolId}
              />
            </div>
        </FormGroup>
        <Button onClick={this.addVoter}  className="button-vote">
          Register
        </Button>
        </div>


      </div>
    );
  }
}

export default RequestVoter;
