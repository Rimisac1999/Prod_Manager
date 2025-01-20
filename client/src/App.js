import React, { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // In production, use relative path
  : process.env.REACT_APP_API_URL || 'http://localhost:5001/api';  // In development, use environment variable or fallback

function App() {
  const [points, setPoints] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [buttons, setButtons] = useState([]);
  
  // Button creation state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newButtonName, setNewButtonName] = useState('');
  const [newButtonPoints, setNewButtonPoints] = useState('');
  const [newButtonType, setNewButtonType] = useState('add');

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setError('');
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  // Fetch user data (points and buttons)
  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/user-data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPoints(data.points);
        setButtons(data.buttons || []);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      handleLogout();
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchUserData();
      setIsLoggedIn(true);
    }
  }, [token, fetchUserData]);

  // Save buttons to server
  const saveButtons = async (newButtons) => {
    try {
      const response = await fetch(`${API_URL}/buttons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ buttons: newButtons })
      });
      if (!response.ok) {
        throw new Error('Failed to save buttons');
      }
    } catch (error) {
      console.error('Error saving buttons:', error);
    }
  };

  const handleCreateButton = async (e) => {
    e.preventDefault();
    const newButton = {
      id: Date.now().toString(),
      name: newButtonName,
      points: parseInt(newButtonPoints),
      type: newButtonType
    };
    const updatedButtons = [...buttons, newButton];
    setButtons(updatedButtons);
    await saveButtons(updatedButtons);
    setNewButtonName('');
    setNewButtonPoints('');
    setShowCreateForm(false);
  };

  const handleDeleteButton = async (buttonId) => {
    const updatedButtons = buttons.filter(button => button.id !== buttonId);
    setButtons(updatedButtons);
    await saveButtons(updatedButtons);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setPoints(data.points);
        setButtons(data.buttons || []);
        setIsLoggedIn(true);
        setError('');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setError('Server error. Please try again.');
    }
  };

  const updatePoints = async (newPoints) => {
    try {
      const response = await fetch(`${API_URL}/points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ points: newPoints })
      });
      const data = await response.json();
      
      if (response.ok) {
        setPoints(data.points);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error updating points:', error);
      handleLogout();
    }
  };

  const handleButtonClick = (button) => {
    const newPoints = button.type === 'add' 
      ? points + button.points 
      : Math.max(0, points - button.points);
    updatePoints(newPoints);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <form onSubmit={handleLogin} style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          width: '300px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        right: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px' 
      }}>
        <span style={{ fontSize: '24px' }}>Points: {points}</span>
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '20px',
        paddingTop: '60px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            {showCreateForm ? 'Cancel' : 'Create New Button'}
          </button>

          {showCreateForm && (
            <form onSubmit={handleCreateButton} style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Button Name"
                  value={newButtonName}
                  onChange={(e) => setNewButtonName(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                  required
                />
                <input
                  type="number"
                  placeholder="Points Value"
                  value={newButtonPoints}
                  onChange={(e) => setNewButtonPoints(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                  required
                  min="1"
                />
                <select
                  value={newButtonType}
                  onChange={(e) => setNewButtonType(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                >
                  <option value="add">Add Points</option>
                  <option value="subtract">Subtract Points</option>
                </select>
              </div>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Button
              </button>
            </form>
          )}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '10px' 
        }}>
          {buttons.map(button => (
            <div key={button.id} style={{
              position: 'relative',
              backgroundColor: button.type === 'add' ? '#28a745' : '#dc3545',
              padding: '15px',
              borderRadius: '4px',
              color: 'white'
            }}>
              <button
                onClick={() => handleButtonClick(button)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'transparent',
                  border: '2px solid white',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginBottom: '5px'
                }}
              >
                {button.name} ({button.type === 'add' ? '+' : '-'}{button.points})
              </button>
              <button
                onClick={() => handleDeleteButton(button.id)}
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  width: '20px',
                  height: '20px',
                  padding: 0,
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '12px',
                  lineHeight: '1'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
