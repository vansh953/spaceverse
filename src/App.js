import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./components/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Projects from "./pages/Project";
import Profile from "./pages/profile";
import Earth from "./pages/Earth"; 
import Navbar from "./components/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <>
      {user && <Navbar user={user} />}
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Landing />}
        />
        <Route
          path="/signin"
          element={user ? <Navigate to="/home" /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/home" /> : <SignUp />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/signin" />}
        />
        <Route
          path="/explore"
          element={user ? <Explore /> : <Navigate to="/signin" />}
        />
        <Route
          path="/projects"
          element={user ? <Projects /> : <Navigate to="/signin" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/signin" />}
        />
        <Route
          path="/earth"
          element={user ? <Earth /> : <Navigate to="/signin" />}  
        />
      </Routes>
    </>
  );
}

export default App;
