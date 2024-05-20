// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Chat {
    struct Message {
        address sender;
        string content;
        uint timestamp;
    }

    struct User {
        string username;
        address[] friends;
    }

    mapping(address => User) public users;
    Message[] public messages;

    event MessageSent(address indexed sender, string content, uint timestamp);
    event UserRegistered(address indexed user, string username);
    event FriendAdded(address indexed user, address friend);

    modifier userExists() {
        require(bytes(users[msg.sender].username).length != 0, "User not registered");
        _;
    }

  function register(string memory _username) public {
    require(bytes(users[msg.sender].username).length == 0, "User already registered");
    users[msg.sender] = User(_username, new address[](0));
    emit UserRegistered(msg.sender, _username);
}

    function addFriend(address _friend) public userExists {
        require(bytes(users[_friend].username).length != 0, "Friend not registered");
        users[msg.sender].friends.push(_friend);
        emit FriendAdded(msg.sender, _friend);
    }

    function sendMessage(string memory _content) public userExists {
        messages.push(Message(msg.sender, _content, block.timestamp));
        emit MessageSent(msg.sender, _content, block.timestamp);
    }

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }

    function getFriends() public view userExists returns (address[] memory) {
        return users[msg.sender].friends;
    }

    function getUsername(address _user) public view returns (string memory) {
        return users[_user].username;
    }
}
