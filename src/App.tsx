import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { HouseholdsPage } from './pages/HouseholdsPage';
import { SignaturePage } from './pages/SignaturePage';
import { SignedContractsPage } from './pages/SignedContractsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { OnlineProvider } from './contexts/OnlineContext';

function App() {
  return (
    <OnlineProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HouseholdsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signature/:id"
          element={
            <ProtectedRoute>
              <SignaturePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signed-contracts"
          element={
            <ProtectedRoute>
              <SignedContractsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </OnlineProvider>
  );
}

export default App;