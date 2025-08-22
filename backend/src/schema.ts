import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    name: String!
    email: String!
    avatarUrl: String
  }

  type Event {
    id: ID!
    name: String!
    location: String!
    startTime: DateTime!
    attendees: [User!]!
    attendeeCount: Int!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    events: [Event!]!
    event(id: ID!): Event
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    joinEvent(eventId: ID!): Event!
    leaveEvent(eventId: ID!): Event!
    deleteAccount: Boolean!
  }
`;
