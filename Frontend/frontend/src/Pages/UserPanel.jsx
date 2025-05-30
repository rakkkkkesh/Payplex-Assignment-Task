import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'https://payplex-assignment-task-backend.onrender.com';
const API_URL = `${API_BASE_URL}/api/pages`;

function UserPanel() {
  const [activePages, setActivePages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPages = async () => {
    try {
      const res = await axios.get(API_URL);
      const active = res.data.filter(p => p.isActive);
      setActivePages(active);
    } catch (error) {
      console.error('Failed to load user pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div className="container mt-3 mt-md-5 px-3 px-sm-0">
      <div className="text-center">
        <h1 className="display-4 fw-bold mb-3 mb-md-4" style={{ color: '#ff4081', fontSize: 'calc(1.5rem + 1.5vw)' }}>
          User Panel
        </h1>
        <p className="lead text-muted mb-3 mb-md-4">
          Browse the available active home pages.
        </p>

        {isLoading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : activePages.length > 0 ? (
          <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3">
            {activePages.map((page, index) => (
              <Link
                key={page._id}
                to={`/home/${page._id}`}
                className="btn btn-lg btn-outline-success px-3 px-md-4 py-2 py-md-3 shadow-sm"
                style={{ minWidth: '120px', flex: '1 0 auto', maxWidth: '200px' }}
              >
                {/* {page.header || `Home ${index + 1}`} */}
                {`Home ${index + 1}`}
              </Link>
            ))}
          </div>
        ) : (
          <div className="alert alert-warning mt-4 mx-auto" style={{ maxWidth: '500px' }} role="alert">
            No active pages to show at the moment.
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPanel;