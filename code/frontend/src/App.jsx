import React from "react"; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import ClassSearch from './Pages/ClassSearch';
import Schedule from "./Pages/Schedule";
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useState, useEffect } from 'react';
import Register from './Pages/Register';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register?" element={<Register />} />
        <Route path="/classSearch-dev" element={<ClassSearch />} />

       {user && <Route path="/classSearch" element={<ClassSearch />} />}
       {user && <Route path="/schedule" element={<Schedule />} />}
      </Routes>
    </Router>
  );
}

export default App;

