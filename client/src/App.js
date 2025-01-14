import React, { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function App() {
  const [points, setPoints] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setError('');
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        const response = await fetch(`${API_URL}/points`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setPoints(data.points);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Error fetching points:', error);
        handleLogout();
      }
    };

    if (token) {
      fetchPointsData();
      setIsLoggedIn(true);
    }
  }, [token, handleLogout]);

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

  const addPoints = (amount) => {
    updatePoints(points + amount);
  };

  const removePoints = (amount) => {
    updatePoints(Math.max(0, points - amount));
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
        height: '100vh',
        gap: '20px',
        paddingTop: '60px'
      }}>
        {/* Top Half - Add Points */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h2>Add Points</h2>
          <button onClick={() => addPoints(10)} style={{ padding: '10px', cursor: 'pointer' }}>Add 10 points</button>
          <button onClick={() => addPoints(20)} style={{ padding: '10px', cursor: 'pointer' }}>Add 20 points</button>
          <button onClick={() => addPoints(30)} style={{ padding: '10px', cursor: 'pointer' }}>Add 30 points</button>
          <button onClick={() => addPoints(40)} style={{ padding: '10px', cursor: 'pointer' }}>Add 40 points</button>
          <button onClick={() => addPoints(50)} style={{ padding: '10px', cursor: 'pointer' }}>Add 50 points</button>
        </div>

        {/* Bottom Half - Remove Points */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h2>Remove Points</h2>
          <button onClick={() => removePoints(10)} style={{ padding: '10px', cursor: 'pointer' }}>Remove 10 points</button>
          <button onClick={() => removePoints(20)} style={{ padding: '10px', cursor: 'pointer' }}>Remove 20 points</button>
          <button onClick={() => removePoints(30)} style={{ padding: '10px', cursor: 'pointer' }}>Remove 30 points</button>
          <button onClick={() => removePoints(40)} style={{ padding: '10px', cursor: 'pointer' }}>Remove 40 points</button>
          <button onClick={() => removePoints(50)} style={{ padding: '10px', cursor: 'pointer' }}>Remove 50 points</button>
        </div>
      </div>
    </div>
  );
}

export default App;
