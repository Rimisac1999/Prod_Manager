# Point Tracker Application

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Firebase project set up with the following configuration in `client/.env`:
  ```
  REACT_APP_FIREBASE_API_KEY=your_api_key
  REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
  REACT_APP_FIREBASE_PROJECT_ID=your_project_id
  REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
  REACT_APP_FIREBASE_APP_ID=your_app_id
  ```

### Installation
1. Clone the repository
2. Navigate to the project directory
3. Install server dependencies:
   ```bash
   npm install
   ```
4. Navigate to the client directory and install dependencies:
   ```bash
   cd client
   npm install
   ```

### Running the Application
1. Start the server:
   ```bash
   npm start
   ```
2. In a new terminal, start the React client:
   ```bash
   cd client
   npm start
   ```

### Usage
- Access the application at `http://localhost:3000`
- Use the sign-up and login features to manage your points

### Troubleshooting
- Ensure all environment variables are set correctly in `client/.env`
- Check the console for any error messages and follow the instructions to resolve them

### Additional Notes
- Ensure your IP is whitelisted in MongoDB Atlas for database access
- For any Firebase-related issues, verify your Firebase configuration in the Firebase Console
