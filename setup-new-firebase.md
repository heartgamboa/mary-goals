# Setup New Firebase Project

## Step 1: Create New Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name: "dancefit-portfolio"
4. Enable Google Analytics: No (optional)
5. Click "Create project"

## Step 2: Enable Services
1. **Authentication:**
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Click Save

2. **Firestore Database:**
   - Go to Firestore Database → Create database
   - Start in test mode
   - Choose location
   - Click Done

3. **Storage:**
   - Go to Storage → Get started
   - Start in test mode
   - Choose same location as Firestore
   - Click Done

## Step 3: Get Config
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web icon
4. Register app: "DanceFit Portfolio"
5. Copy the config object

## Step 4: Update firebaseConfig.js
Replace the config in firebaseConfig.js with your new project's config.

