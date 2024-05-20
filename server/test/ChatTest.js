const Chat = artifacts.require("Chat");

contract("Chat", accounts => {
    let chatInstance;

    const user1 = accounts[0];
    const user2 = accounts[1];
    const user3 = accounts[2];

    const username1 = "Alice";
    const username2 = "Bob";

    before(async () => {
        chatInstance = await Chat.deployed();
    });

    it("should register a user", async () => {
        await chatInstance.register(username1, { from: user1 });
        const userData = await chatInstance.users(user1);
        console.log("User Data:", userData);
        assert.equal(userData.username, userData.username, "The username of user1 should be Alice");
    });

    it("should not allow a user to register twice", async () => {
        try {
            await chatInstance.register(username1, { from: user1 });
            assert.fail("User should not be able to register twice");
        } catch (error) {
            assert(error.message.includes("User already registered"), "Expected error message not found");
        }
    });

    it("should add a friend", async () => {
        await chatInstance.register(username2, { from: user2 });
        await chatInstance.addFriend(user2, { from: user1 });

        const friends = await chatInstance.getFriends({ from: user1 });
        assert.equal(friends.length, 1, "User1 should have 1 friend");
        assert.equal(friends[0], user2, "User2 should be User1's friend");
    });

    it("should not add a non-registered user as a friend", async () => {
        try {
            await chatInstance.addFriend(user3, { from: user1 });
            assert.fail("Should not be able to add a non-registered user as a friend");
        } catch (error) {
            assert(error.message.includes("Friend not registered"), "Expected error message not found");
        }
    });

    it("should send a message", async () => {
        const messageContent = "Hello, world!";
        await chatInstance.sendMessage(messageContent, { from: user1 });

        const messages = await chatInstance.getMessages();
        assert.equal(messages.length, 1, "There should be one message");
        assert.equal(messages[0].content, messageContent, "Message content should match");
        assert.equal(messages[0].sender, user1, "Message sender should be User1");
    });

    it("should retrieve username", async () => {
        const retrievedUsername = await chatInstance.getUsername(user1);
        assert.equal(retrievedUsername, username1, "The retrieved username should be Alice");
    });
});
