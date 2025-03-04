// src/pages/Home.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import '../style.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Static events – these could later come from an API call to your backend.
  const events = [
    { id: 1, title: 'Event 1', description: 'Event 1 Description' },
    { id: 2, title: 'Event 2', description: 'Event 2 Description' },
    { id: 3, title: 'Event 3', description: 'Event 3 Description' },
  ];

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/events/get");
        setData(response.data); // Store the fetched data
        setError(null); // Clear any previous errors
      } catch (err) {
        setError("Failed to fetch Events");
        setData(null); // Clear previous data
      }
    };
    const fetchUsers= async () => {
      try {
        const response = await axios.get("http://localhost:8080/users/get");
        setData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch Users");
        setData(null);
      }
    };

  return (
    <div>
      <header>
        <div className="logo">GatorFinder</div>
        <nav className="nav-buttons">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </nav>
      </header>
      <main>
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="icon">
              <i className="fas fa-search"></i>
            </span>
          </div>
        </div>
        <div className="feed">
          {filteredEvents.map(event => (
            <div key={event.id} className="post">
              <div className="post-content">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
            <button onClick={fetchEvents}>Get Events</button> 
            <button onClick={fetchUsers}>Get Users</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {data && (
              <pre style={{ textAlign: "left", background: "#f4f4f4", padding: "10px" }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
        </div>
      </main>
    </div>
  );
};

export default Home;
