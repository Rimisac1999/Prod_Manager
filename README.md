# Points Manager

A simple React-based points management system with user authentication and session persistence.

## Features

- User Authentication
  - Login system with username/password
  - Session persistence
  - Secure password handling

- Points Management
  - Custom button creation
  - Add or subtract points with custom values
  - Name your own buttons
  - Delete buttons you don't need
  - Points counter
  - Points persistence between sessions

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Rimisac1999/Prod_Manager
```

2. Install dependencies:
```bash
cd Prod_Manager
npm install
cd client
npm install
```

3. Start the development server:
```bash
# In the root directory
npm start

# In another terminal, in the client directory
cd client
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Login Credentials

- Username: casimirdebonneval
- Password: wFsKw3gOFnGTx8CF

## Technologies Used

- React 18
- MongoDB for data persistence
- Express.js backend
- JWT authentication
- Modern React Hooks (useState, useEffect)

## Project Structure

```
├── client/                # React frontend
│   ├── public/
│   └── src/
│       ├── App.js        # Main application component
│       └── index.js      # Application entry point
└── server.js             # Express backend server
```

## Features in Detail

### Authentication
- Secure login system with JWT
- Error handling for invalid credentials
- Session persistence using tokens
- Logout functionality

### Points System
- Create custom buttons with:
  - Custom names
  - Custom point values
  - Add or subtract functionality
- Points are saved in MongoDB
- Cannot go below 0 points
- Real-time points display
- Buttons persist between sessions
- Delete unwanted buttons

### Button Management
- Create new buttons with custom:
  - Names
  - Point values
  - Type (add/subtract)
- Delete existing buttons
- Buttons are saved locally
- Grid layout for easy access

## Contributing

Feel free to submit issues and enhancement requests. 