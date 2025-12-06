import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="file/:fileId" element={<Dashboard />} />
            {/* Future routes: /shared, /recent, etc. can reuse Dashboard component with different props or new components */}
            <Route path="shared" element={<Dashboard filter="shared" />} />
            <Route path="recent" element={<div className="p-8 text-white">Recent Files (Coming Soon)</div>} />
            <Route path="starred" element={<div className="p-8 text-white">Starred Files (Coming Soon)</div>} />
            <Route path="trash" element={<div className="p-8 text-white">Trash (Coming Soon)</div>} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
