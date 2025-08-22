export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
};


export type Event = {
  id: string;
  name: string;
  location: string;
  startTime: string;
  attendees: User[];
};


export type AuthPayload = {
  token: string;
  user: User;
};
