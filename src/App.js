import Dashboard from "./Components/Dashboard";
import SignIn from "./Components/login";
import Login from "./Components/login";
import SignUp from "./Components/Signup";


import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
