import React, { Component } from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import { Button } from 'react-bootstrap';


class Admin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Election: undefined,
      account: null,
      web3: null,
      isOwner:false,
      start:false,
      end:false
    }
  }

  addCandidate = async () => {

    await this.state.Election.methods.addCandidate(this.state.name, this.state.party, this.state.manifesto, this.state.schoolId).send({from : this.state.account , gas: 1000000});
    // Reload
    window.location.reload(false);
  }

  startElection = async () => {
    await this.state.Election.methods.startElection().send({from : this.state.account , gas: 1000000});
    window.location.reload(false);
  }

  endElection = async () => {
    await this.state.Election.methods.endElection().send({from : this.state.account , gas: 1000000});
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
    return (
      <div className="App">
        {/* <div>{this.state.owner}</div> */}
        {/* <p>Account address - {this.state.account}</p> */}
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              ADMIN PORTAL
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}


        <div className="admin-buttons">
          {this.state.start
            ? <Button onClick={this.startElection} className="admin-buttons-start-s">Start Election</Button>
            : <Button onClick={this.startElection} className="admin-buttons-start-e">Start Election</Button>
          }
          {this.state.end
            ? <Button onClick={this.endElection} className="admin-buttons-end-s">End Election</Button>
            : <Button onClick={this.endElection} className="admin-buttons-end-e">End Election</Button>
          }
        </div>

      </div>
    );
  }
}

export default Admin;
