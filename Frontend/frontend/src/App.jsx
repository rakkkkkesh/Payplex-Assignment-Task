import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Components/Navbar';
import AdminDashboard from './Components/AdminDashboard';
import AdminForm from './Components/AdminForm';
import Home from './Pages/Home';
import UserPanel from './Pages/UserPanel';

// const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'https://payplex-assignment-task-backend.onrender.com';
const API_URL = `${API_BASE_URL}/api/pages`;

function App() {
  const [activePages, setActivePages] = useState([]);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        const active = res.data.filter(p => p.isActive);
        setActivePages(active);
      })
      .catch(() => alert('Failed to load user pages'));
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="container my-4">
        <Routes>
          <Route
            path="/"
            element={
              <div className="row justify-content-center text-center">
                <div className="col-12 col-md-10 col-lg-8">
                  <h1 className="mb-4 display-5 fw-bold"
                    style={{ color: '#ff4081' }}
                  >
                    Welcome to the Admin & User Portal
                  </h1>
                  <p className="lead text-muted mb-4">
                    Manage and view dynamic pages with ease.
                  </p>
                  <div className="d-grid gap-3 d-md-flex justify-content-md-center">
                    <Link
                      to="/admin"
                      className="btn btn-primary btn-lg px-4 py-2 shadow-sm"
                    >
                      Admin Panel
                    </Link>

                    <Link
                      to="/user"
                      className="btn btn-info btn-lg px-4 py-2 shadow-sm text-white"
                    >
                      User Panel
                    </Link>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<AdminForm />} />
          <Route path="/admin/edit/:id" element={<AdminForm />} />
          <Route path="/user" element={<UserPanel />} />
          {activePages.map((page, index) => (
            <Route
              key={page._id}
              path={`/home${index + 1}`}
              element={<Home page={page} pageName={`Home ${index + 1}`} />}
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;