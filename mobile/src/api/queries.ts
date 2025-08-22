// GraphQL ops
export const REGISTER = `
mutation Register($name:String!, $email:String!, $password:String!) {
  register(name:$name, email:$email, password:$password) {
    token
    user {
      id
      name
      email
      avatarUrl
    }
  }
}
`;

export const LOGIN = `
mutation Login($email:String!, $password:String!) {
  login(email:$email, password:$password) {
    token
    user {
      id
      name
      email
      avatarUrl
    }
  }
}
`;

export const ME = `
query {
  me {
    id
    name
    email
    avatarUrl
  }
}
`;

export const EVENTS = `
query {
  events {
    id
    name
    location
    startTime
    attendees {
      id
      name
      email
      avatarUrl
    }
  }
}
`;

export const JOIN_EVENT = `
mutation JoinEvent($eventId:ID!) {
  joinEvent(eventId:$eventId) {
    id
    attendees {
      id
      name
      email
      avatarUrl
    }
  }
}
`;

export const LEAVE_EVENT = `
mutation LeaveEvent($eventId:ID!) {
  leaveEvent(eventId:$eventId) {
    id
    attendees {
      id
      name
      email
      avatarUrl
    }
  }
}
`;

export const DELETE_ACCOUNT = `
mutation {
  deleteAccount
}
`;
export const EVENT_UPDATED = `
subscription EventUpdated($eventId: ID!) {
  eventUpdated(eventId: $eventId) {
    id
    attendees { id name email avatarUrl }
  }
}
`;
