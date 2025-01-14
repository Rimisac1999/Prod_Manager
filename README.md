# Points Manager

A simple React-based points management system with user authentication and session persistence.

## Features

- User Authentication
  - Login system with username/password
  - Session persistence
  - Secure password handling

- Points Management
  - Add points (10, 20, 30, 40, 50)
  - Remove points (10, 20, 30, 40, 50)
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
cd client
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Login Credentials

- Username: Casimir
- Password: Pa$$w0rd

## Technologies Used

- React 18
- Local Storage for data persistence
- Modern React Hooks (useState, useEffect)

## Project Structure

```
client/
  ├── public/
  │   └── index.html
  └── src/
      ├── App.js        # Main application component
      └── index.js      # Application entry point
```

## Features in Detail

### Authentication
- Secure login system
- Error handling for invalid credentials
- Session persistence using localStorage
- Logout functionality

### Points System
- Points are saved between sessions
- Cannot go below 0 points
- Simple and intuitive interface
- Real-time points display

## Contributing

Feel free to submit issues and enhancement requests. 