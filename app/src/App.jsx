import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import Monitor from './pages/Monitor';
import ProfilePage from './pages/ProfilePage';
import UserDashboard from './pages/UserDashboard';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        {/* Protected Route */}
        <Route 
          path="/profile/:id" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        {/* Protected Route */}
        <Route 
          path="/dashboard/:id" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        {/* Protected Route */}
        <Route 
          path="/list" 
          element={
            <ProtectedRoute>
              <EmployeeList />
            </ProtectedRoute>
          } 
        />
        {/* Protected Route */}
        <Route 
          path="/monitor" 
          element={
            <ProtectedRoute>
              <Monitor />
            </ProtectedRoute>
          } 
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App