// migrations/2_deploy_contracts.js
const Chat = artifacts.require("Chat");

module.exports = function (deployer) {
  deployer.deploy(Chat);
};
