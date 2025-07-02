# Cut D' Crop Frontend (EXPO)

## Table of contents 
1. [Prerequisites](#prerequisites)
2. [Installation and setup](#installation)

## Prerequisites
1. Nodejs v14+
2. npm or yarn
3. clerk instance
4. Expo Go
5. The backend server of this project running
   ( optional but recommended )
   
## Installation
1. Install dependencies:
   - Navigate to the frontend directory and run:
   - yarn install (if using yarn)
   - npm install (if using npm)
2. set environment variables
   - create a .env.local an provide
     the following variables
   1. EXPO_PUBLIC_API_URL = http://127.0.0.1:8000/
   2. EXPO_PUBLIC_WS_URL = ws://127.0.0.1:8000/
   3. EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
      > navigate to you clerk instance -> dashboard
      -> configure -> API keys and copy the Public key
      then paste it here
3. Run the app
   - npx expo start
   - scan the qr code using expo go
     ( or camera app ) on ios*

*That's it, you can now use the app!*
