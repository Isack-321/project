import React, { Component} from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';
import Timer from './Timer';
class Home extends Component {

constructor(props) {
  super(props);

  this.state = {

    Election: undefined,
    account: null,
    Web3: null,
    isOwner: false

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

  return (
    <div className="App">
      {/* <div>{this.state.owner}</div> */}
      {/* <p>Account address - {this.state.account}</p> */}
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
            Welcome...
          </h1>
        </div>
      </div>
      {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

      <div className="home">
          STUDENT'S VOTING SYSTEM <br/>
          {this.state.start ? <Timer/> : <span>election will start soon</span>}
                 </div>

    </div>
  );
}
}

export default Home;