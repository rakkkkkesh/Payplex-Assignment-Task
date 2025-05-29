import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/pages';

function UserPanel() {
  const [activePages, setActivePages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        const active = res.data.filter(p => p.isActive);
        setActivePages(active);
      })
      .catch(() => alert('Failed to load user pages'))
      .finally(() => setIsLoading(false));
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
            {activePages.map((_, index) => (
              <a
                key={index}
                href={`/home${index + 1}`}
                className="btn btn-lg btn-outline-success px-3 px-md-4 py-2 py-md-3 shadow-sm"
                style={{ minWidth: '120px', flex: '1 0 auto', maxWidth: '200px' }}
              >
                Home{index + 1}
              </a>
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