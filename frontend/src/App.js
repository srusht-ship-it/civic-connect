import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import LandingPage from './LandingPage';
import Login from './Login';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import NewDashboard from './NewDashboard';
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-dashboard" element={<NewDashboard />} />
              <Route path="/report-issue" element={<ReportIssue />} />
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
