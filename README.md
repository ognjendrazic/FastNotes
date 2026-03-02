# FastNotes

#### Course: IKT-205 App Development

University of Grimstad, Norway

**FastNotes** is a lightweight personal note-taking application built with **React Native** and **Expo**.
The app allows users to create, view, and read notes **locally in memory** during an active app session. User authentication is handled by **Supabase**.

## Features

- Create new notes
- View a list of existing notes
- Open and read individual notes
- Login/Signup with Supabase Authentication (Email and Password)
- Notes are stored in database (postgress via supabase) based on user.id

## Tech Stack

- React Native
- Expo
- Node.js (**v24 LTS recommended**)
- Other dependencies are retrived via **npm install**

## Prerequisites

Ensure the following are installed:

- **Node.js** (v24 or newer recommended)
- **npm** (included with Node.js)
- **Expo Go** (optional, for testing on a physical device)

## Build & Run

After cloning the repository, install the required dependencies:
```bash
npm install
```

Start the development server:
```bash
npx expo start
```

If your phone and computer are on different networks, use tunnel mode:
```bash
npx expo start --tunnel
```

**Note:** Your computer and phone must be on the same network to view the app in Expo Go.
