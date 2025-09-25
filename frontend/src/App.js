import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './LandingPage';
import Login from './Login';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import AdminPage from './pages/admin/AdminPage';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportIssue from './components/ReportIssue';
import TermsPrivacy from './TermsPrivacy';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected Citizen Routes */}
              <Route 
                path="/citizen-dashboard" 
                element={
                  <ProtectedRoute requireCitizen={true}>
                    <CitizenDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/report-issue" 
                element={
                  <ProtectedRoute>
                    <ReportIssue />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Legacy Dashboard Route - redirect based on role */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/terms" element={<TermsPrivacy />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
