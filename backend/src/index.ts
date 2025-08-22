import 'dotenv/config';
import express from 'express';
import cors from "cors";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema.js";
import { Query } from "./resolvers/Query.js";
import { Mutation } from "./resolvers/Mutation.js";
import { Event } from "./resolvers/Event.js";
import { User } from "./resolvers/User.js";
import { createContext } from "./context.js";
import { Server as IOServer } from "socket.io";
import { setupSocket } from "./socket.js";
import { GraphQLScalarType, Kind } from "graphql";

const PORT = Number(process.env.PORT || 4000);
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);

const httpServer = http.createServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
    credentials: true,
  },
});
setupSocket(io);

// DateTime scalar
const DateTime = new GraphQLScalarType({
  name: "DateTime",
  serialize: (value: any) => new Date(value).toISOString(),
  parseValue: (value: any) => new Date(value),
  parseLiteral: (ast) => (ast.kind === Kind.STRING ? new Date(ast.value) : null),
});

const server = new ApolloServer({
  typeDefs,
  resolvers: { Query, Mutation, Event, User, DateTime },
  context: createContext(io),
});

await server.start();
server.applyMiddleware({ app, path: "/graphql" });

app.get("/", (_req, res) => res.send("API OK"));

httpServer.listen(PORT, () => {
  console.log(`GraphQL: http://localhost:${PORT}/graphql`);
});
