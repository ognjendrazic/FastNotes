# FastNotes

#### Course: IKT-205 App Development

University of Grimstad, Norway

**FastNotes** is a lightweight personal note-taking application built with **React Native** and **Expo**.
User authentication and data storage are handled by **Supabase**.

> **Note:** A pre-built APK is available in the [Releases](../../releases) section for testing on a physical Android device or emulator. Simply download and install it, no build steps required. Make sure "Install from unknown sources" is enabled on your device.
****

## Features
<details>
<summary>Click to expand</summary>

- Create new notes
- View a list of existing notes
- Open and read individual notes
- Login/Signup with Supabase Authentication (Email and Password)
- Notes are stored in a database (PostgreSQL via Supabase)
- Full CRUD operations (create, read, update and delete)
- View company notes on a separate screen (read-only)
- Secure credentials with expo-secure-storage
- Upload images to notes via image gallery or camera
- Push notifications for new notes
- Pagination (limit of five notes per page)
</details>

## Prerequisites

Ensure the following are installed:

- **Node.js** (v24 LTS)
- **Expo CLI**
- **Supabase CLI**, Installed as a dev dependecy, use npx supabase

****

## Setup & Build

Install Dependencies
```bash
npm install # below steps wont work without dependecies
```

### 1. Supabase (Database)
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/setup.sql`
3. Copy `.env.example` to `.env` and fill in your project URL and publishable key from **Project Overview → Data API**

### 2. Firebase (Push Notifications)
1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Add an Android app with package name `com.crusadez.FastNotes`
3. Download `google-services.json` and place it in the project root

### 3. Edge Function (Push Notifications)
1. Deploy the edge function to your Supabase project (or manually create it on the remote):
```bash
supabase login
```
```bash
supabase link
```
```bash
supabase functions deploy notify-new-note
```

### 4. Webhook
1. In the Supabase dashboard click **Integrations** in the left pane and download the **Database Webhooks** integration
2. Create a new webhook called `on-note-inserted`, table `public.Notes`, event: `Insert`, webhook configuration: `Supabase Edge Functions`, choose `notify-new-note`, click `Create`

### 5. Expo CLI
1. Create an Expo account at [expo.dev](https://expo.dev)
2. Login via CLI:
```bash
eas login
```
3. Create expo project and link it
```bash
eas init
```
4. Generate a private key from Firebase:
   - Go to **Firebase Console → Your App → Settings → Service Accounts → Firebase Admin SDK**
   - Click **Generate new private key** and download the JSON file to your project root

5. Setup credentials with the new private key, run:
```bash
eas credentials
```
Go to **Android → Development → Google Service Account → Manage Push Notifications → Setup New Key** and select the downloaded JSON file

### 6. Run
```bash
npx expo run:android # local development build (needed for push notifications to work)
```

### Build APK or IPA
Remember to remove the **google-services.json** from **.gitignore** before starting a build to expo.dev or it will fail
Also add your env variables to expo.dev under environment variables, so eas build can pick them up and bake them in
```bash
eas build --platform android --profile preview --local
eas build --platform ios --profile preview --local
# You can drop --local if you want to build over cloud
# Follow the steps and make sure app is initialized in expo.dev
```
