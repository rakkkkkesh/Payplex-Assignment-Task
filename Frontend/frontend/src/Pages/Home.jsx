import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ page, pageName }) => {
  const navigate = useNavigate();
  return (
    <div
      className="container my-5 p-4 shadow rounded bg-white"
      style={{ maxWidth: '400px', height: 'auto' }}
    >
      {/* Page Name Heading */}
      <h3 className="text-center mb-4 fw-bold" style={{ color: '#ff4081' }}>
        {pageName}
      </h3>

      {/* Logo */}
      <div className="mb-4">
        <strong>Logo:</strong>
        <div className="mt-2">
          <img
            src={`http://localhost:5000${page.logo}`}
            alt="Logo"
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
          />
        </div>
      </div>

      {/* Email ID */}
      <div className="d-flex align-items-center mb-4">
        <strong style={{ minWidth: '90px' }}>Email ID:</strong>
        <a href={`mailto:${page.mailId}`} className="ms-3 text-decoration-none">
          {page.mailId}
        </a>
      </div>

      {/* Contact */}
      <div className="d-flex align-items-center mb-4">
        <strong style={{ minWidth: '90px' }}>Contact:</strong>
        <a href={`tel:${page.contact}`} className="ms-3 text-decoration-none">
          {page.contact}
        </a>
      </div>

      {/* Banner Image */}
      <div className="mb-4">
        <strong>Banner Image:</strong>
        <div className="mt-2 text-center">
          <img
            src={`http://localhost:5000${page.bannerImage}`}
            alt="Banner"
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <strong style={{ minWidth: '90px' }}>Header:</strong>
        <div className="ms-3 fw-bold fs-5">{page.header}</div>
      </div>

      {/* Text */}
      <div className="d-flex align-items-start mb-4">
        <strong style={{ minWidth: '90px' }}>Text:</strong>
        <p className="ms-3 mb-0" style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
          {page.text}
        </p>
      </div>

      {/* Address */}
      <div className="d-flex align-items-center text-muted mb-3">
        <strong style={{ minWidth: '90px' }}>Address:</strong>
        <small className="ms-3">{page.address}</small>
      </div>
       <button
    type="button"
    className="btn btn-secondary align-items-center"
    onClick={() => navigate('/user')}
  >
    Go Back
  </button>
    </div>
  );
};

export default Home;