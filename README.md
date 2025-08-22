# Realtime Event Check-In 🎉

A fullstack Realtime Event Management app with:

Backend: Node.js, Express, GraphQL, Prisma, Socket.IO

Frontend: React Native (Expo), Zustand, React Query, Expo Router

Realtime updates: Users can join/leave events and instantly see who else is attending.

# There is the drive link of preview video of this project assignment - >

https://drive.google.com/file/d/1aWPWWzz4OEYGMxo4D0kcFVPrpVm8V1WN/view?usp=sharing


# Installation & Setup
1. Clone the repository
git clone https://github.com/Elestra-Dev/Real-time-Events-check-in.git
cd realtime-event-checkin


The repo has two main parts:

server/ → Backend (GraphQL + Prisma + Socket.IO)

mobile/ → Frontend (React Native with Expo)

2. Backend Setup (server/)

Go into the backend folder:

cd backend


Install dependencies:

npm install


### Environment Variables

Create a `.env` file in the root directory with the following values:

```env
DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@localhost:5432/realtime_checkin?schema=public"  # use your postgres password
JWT_SECRET="your-secret-key"  # give any secret key you want
PORT=4000
SOCKET_PORT=4001
CLIENT_ORIGIN=http://192.168.x.x:19006  # run `ipconfig` in CMD and get your IPv4 192.168.... number



Run Prisma migrations:

npx prisma migrate dev --name init


Start the backend (GraphQL + Socket.IO):

npm run dev

Then Run, npm run prisma:seed   //for prestored events data

By default:

GraphQL API runs on http://localhost:4000/graphql

Socket.IO runs on http://localhost:4001

3. Frontend Setup (mobile/)

Go into the mobile app folder:

cd ../mobile


Install dependencies:

npm install


### Configure Expo app URL

Open `app.json` (or `app.config.js`) and set your local machine IP for **socket** & **API**.  
Run `ipconfig` in Command Prompt to find your IPv4 address (`192.168.x.x`).

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://192.168.x.x:4000/graphql",
      "socketUrl": "http://192.168.x.x:4001"
    }
  }
}



⚠️ Replace 192.168.x.x with your local network IP (run ipconfig on Windows or ifconfig on Mac/Linux).
This is required so your phone can connect to your local server.

Start the Expo dev server:

npx expo start


Open the Expo Go app on your phone, scan the QR code, and the app should launch 🚀

🔑 Features

User register & login with JWT auth

Protected routes with Zustand + Expo Router

Events dashboard with avatars

Join/leave events with real-time attendee updates (via Socket.IO)

Attendees list shows live participants with names & avatars

🛠️ Tech Stack

Backend: Node.js, Express, GraphQL, Prisma, Socket.IO

Frontend: React Native, Expo, Zustand, React Query, Expo Router

Database: SQLite (local) or switch to Postgres/MySQL in .env

Auth: JWT


