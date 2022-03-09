const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    rinkeyby: {
      provider: function() {
        return new HDWalletProvider("guide domain miracle now spread brown rice artist mix yard issue carbon", "https://rinkeby.infura.io/v3/f42584fe549f4b6a8862329724810f33")
      },
      network_id: 4
    },
    development: { 
      network_id: "5777", 
      host: 'localhost', 
      port: 7545,
      gas: 6721975,
      gasPrice: 20000000000
    }
  },
  compilers: {
    solc: {
      version: "0.8.9",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
 },
//  rinkeyby: {
//    provider: new HDWalletProvider(secrets.mnemonic, secrets.infuraApiKey),
//    network_id: '4'
//  }
};
