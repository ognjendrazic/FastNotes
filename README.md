# FastNotes

#### Course: IKT-205 App Development

University of Grimstad, Norway

**FastNotes** is a lightweight personal note-taking application built with **React Native** and **Expo**.
User authentication and data storage are handled by **Supabase**.

## Features

- Create new notes
- View a list of existing notes
- Open and read individual notes
- Login/Signup with Supabase Authentication (Email and Password)
- Notes are stored in a database (PostgreSQL via Supabase)
- Full CRUD operations (create, read, update and delete)
- View company notes on a separate screen (read-only)

## Tech Stack

- React Native
- Expo
- Node.js (**v24 LTS recommended**)
- Other dependencies are retrieved via **npm install**

## Prerequisites

Ensure the following are installed:

- **Node.js** (v24 or newer recommended)
- **npm** (included with Node.js)
- **Expo Go** (optional, for testing on a physical device)

## Build & Run

You need to create a **.env** file at the root of the directory. Get your Supabase project URL and publishable key from [Supabase Dashboard](https://app.supabase.com) → Settings → API, then add:
```bash
EXPO_PUBLIC_SUPABASE_URL="your-supabase-url"
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
```

After cloning the repository, install the required dependencies:
```bash
npm install
```

Start the development server:
```bash
npx expo start # Use --tunnel as flag if your phone is on a different network
```
