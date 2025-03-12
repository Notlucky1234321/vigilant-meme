import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard.tsx';
import WorkoutTracker from './pages/WorkoutTracker.tsx';
import NutritionTracker from './pages/NutritionTracker.tsx';
import ProgressTracker from './pages/ProgressTracker.tsx';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="workouts" element={<WorkoutTracker />} />
            <Route path="nutrition" element={<NutritionTracker />} />
            <Route path="progress" element={<ProgressTracker />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;