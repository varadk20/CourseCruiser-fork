// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import HomePage from "./components/HomePage";
import Recommendations from "./components/Recommendations";

import { auth } from "./firebase";
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <><Toaster
      position="top-center"
      reverseOrder={true}
    />

      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={user ? <HomePage /> : <Login />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
