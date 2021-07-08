const { GraphQLServer, PubSub } = require("graphql-yoga");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const userService = require("./services/user.service");
const mongoose = require("mongoose");
const config = require("./config/config");
const tokenService = require("./services/token.service");
const authService = require("./services/auth.service");
const groupService = require("./services/group.service");
const messageService = require("./services/message.service");
const pubsub = new PubSub();

const typeDefs = `
  type Message {
    userId: String!
    groupId: String!
    content: String!
    createdAt: String!
  }

  type Group {
    id: String!
    name: String!
  }

  type Query {
    groups: [Group]
    messagesByGroupId(groupId: String!): [Message]
  }

  type User {
    username: String!
    email: String!
    token: String!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): User!
    storeMessages(userId: String!, groupId: String!, content: String!, createdAt: String!): Message!
  }

  type Subscription {
    subscribeNewMessages: Message
  }
`;

const resolvers = {
  Query: {
    groups: async (parent, args, context, info) => {
      const groupsData = await groupService.getGroups();
      return groupsData;
    },
    messagesByGroupId: async (parent, args, context, info) => {
      const messages = await messageService.getMessagesByGroupId(args.groupId);
      console.log(messages);
      return messages;
    },
  },
  Mutation: {
    register: async (parent, args, context, info) => {
      const newUser = await userService.createUser(args);
      const tokens = await tokenService.generateAuthTokens(newUser);
      const { username, email } = newUser;
      const token = tokens.access.token;
      console.log({ username, email, token });
      return { username, email, token };
    },
    login: async (parent, args, context, info) => {
      const user = await authService.loginUserWithEmailAndPassword(
        args.email,
        args.password
      );
      const tokens = await tokenService.generateAuthTokens(user);
      const { username, email } = user;
      const token = tokens.access.token;
      console.log({ username, email, token });
      return { username, email, token };
    },
    storeMessages: async (parent, args, { pubsub }, info) => {
      const message = await messageService.createMessage(args);
      pubsub.publish("new_message", { subscribeNewMessages: message });
      return message;
    },
  },
  Subscription: {
    subscribeNewMessages: {
      subscribe(root, args, { pubsub }) {
        return pubsub.asyncIterator("new_message");
      },
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

server.express.use(passport.initialize());
passport.use("jwt", jwtStrategy);

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log("Connected to MongoDB");
  const defaultGroupsData = [
    {
      id: "group1",
      name: "Arts group",
    },
    {
      id: "group2",
      name: "Science group",
    },
    {
      id: "group3",
      name: "Math group",
    },
    {
      id: "group4",
      name: "English group",
    },
    {
      id: "group5",
      name: "History group",
    },
  ];
  groupService.insertPredefinedGroups(defaultGroupsData);
  server.start(() => {
    console.log("Server is running on localhost:4000");
  });
});
