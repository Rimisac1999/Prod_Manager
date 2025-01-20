# Point Tracker Application

A full-stack web application for tracking points with dynamic button creation and Firebase authentication.

## Features

- User Authentication with Firebase
- Dynamic button creation for point management
- Real-time point tracking
- MongoDB integration for data persistence
- Responsive UI design

## Prerequisites

- Node.js v21.5.0 or later
- MongoDB Atlas account
- Firebase project

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Rimisac1999/Prod_Manager.git
cd Prod_Manager
```

2. Install dependencies:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. Configure Environment Variables:

Create a `.env` file in the root directory:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5001
```

Create a `.env` file in the client directory:
```
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

4. Configure MongoDB:
- Create a MongoDB Atlas cluster
- Whitelist your IP address in MongoDB Atlas
- Update the MONGODB_URI in your `.env` file

5. Configure Firebase:
- Create a new Firebase project
- Enable Email/Password authentication
- Add your web app to Firebase
- Copy the configuration values to your client `.env` file

## Running the Application

1. Start the server:
```bash
npm start
```

2. In a new terminal, start the client:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## Features Usage

### Authentication
- Sign up with email and password
- Log in with existing credentials
- Automatic session management

### Point Management
- Create custom buttons with:
  - Button name
  - Point value
  - Action type (add/subtract)
- Track points in real-time
- Delete unused buttons
- Points persist across sessions

## Project Structure

```
Prod_Manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.js         # Main application component
│   │   └── firebase.js    # Firebase configuration
│   └── .env               # Client environment variables
├── server.js              # Express backend server
├── package.json           # Server dependencies
└── .env                   # Server environment variables
```

## Troubleshooting

1. Firebase Connection Issues:
   - Verify Firebase configuration in client/.env
   - Check if Firebase Authentication is enabled
   - Ensure correct API keys

2. MongoDB Connection Issues:
   - Check if IP is whitelisted in MongoDB Atlas
   - Verify connection string in .env
   - Ensure MongoDB cluster is running

3. Port Conflicts:
   - Default ports: 3000 (client), 5001 (server)
   - Change ports in .env if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 