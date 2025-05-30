import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'https://payplex-assignment-task-backend.onrender.com';
const API_URL = `${API_BASE_URL}/api/pages`;

const Home = ({ pageId, pageName }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        if (!id) {
          throw new Error('No page ID provided');
        }
        const res = await axios.get(`${API_URL}/${id}`);
        setPage(res.data);
      } catch (error) {
        console.error('Failed to load page:', error);
        toast.error('Failed to load page details');
        navigate('/user');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id, navigate]);

  if (loading) {
    return <div className="d-flex justify-content-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  if (!page) {
    return <div className="alert alert-danger my-5">Page not found</div>;
  }

  return (
    <div
      className="container my-5 p-4 shadow rounded bg-white"
      style={{ maxWidth: '400px', height: 'auto' }}
    >
         {/* Header */}
        <h3 className="text-center mb-4 fw-bold" style={{ color: '#ff4081' }}>{page.header}</h3>

      {/* Logo */}
      <div className="mb-3">
        <strong>Logo:</strong>
        <div className="mt-2">
          <img
            src={`${API_BASE_URL}${page.logo}`}
            alt="Logo"
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
          />
        </div>
      </div>

      {/* Email ID */}
      <div className="d-flex align-items-center mb-2">
        <strong style={{ minWidth: '90px' }}>Email ID:</strong>
        <a href={`mailto:${page.mailId}`} className="ms-3 text-decoration-none">
          {page.mailId}
        </a>
      </div>

      {/* Contact */}
      <div className="d-flex align-items-center mb-2">
        <strong style={{ minWidth: '90px' }}>Contact:</strong>
        <a href={`tel:${page.contact}`} className="ms-3 text-decoration-none">
          {page.contact}
        </a>
      </div>

      {/* Banner Image */}
      <div className="mb-3">
        <strong>Banner Image:</strong>
        <div className="mt-2 text-center">
          <img
            src={`${API_BASE_URL}${page.bannerImage}`}
            alt="Banner"
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
          />
        </div>
      </div>

      {/* Text */}
      <div className="d-flex align-items-start mb-2">
        <strong style={{ minWidth: '90px' }}>Text:</strong>
        <p className="ms-3 mb-0" style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
          {page.text}
        </p>
      </div>

      {/* Address */}
      <div className="d-flex align-items-center text-muted mb-2">
        <strong style={{ minWidth: '90px' }}>Address:</strong>
        <small className="ms-3">{page.address}</small>
      </div>

      {/* Go Back Button */}
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