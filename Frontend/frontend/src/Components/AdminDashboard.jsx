import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

// const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'https://payplex-assignment-task-backend.onrender.com';
const API_URL = `${API_BASE_URL}/api/pages`;

function AdminDashboard() {
  const [pages, setPages] = useState([]);
  const [pageToDelete, setPageToDelete] = useState(null);
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const bsModal = useRef(null);

  // const fetchPages = async () => {
  //   try {
  //     const res = await axios.get(API_URL);
  //     setPages(res.data);
  //     console.log(res.data);
      
  //   } catch (error) {
  //     toast.error('Failed to fetch pages');
  //   }
  // };

  const fetchPages = async () => {
  try {
    const res = await axios.get(API_URL);
    console.log("Full response data:", res.data); // Log the complete response
    res.data.forEach(page => {
      console.log(`Page ${page._id} logo path:`, page.logo);
      console.log(`Page ${page._id} banner path:`, page.bannerImage);
    });
    setPages(res.data);
  } catch (error) {
    toast.error('Failed to fetch pages');
  }
};
  useEffect(() => {
    fetchPages();
    if (modalRef.current) {
      bsModal.current = new window.bootstrap.Modal(modalRef.current);
    }
  }, []);

  const confirmDelete = (id) => {
    setPageToDelete(id);
    bsModal.current.show();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${pageToDelete}`);
      toast.success('Page deleted successfully');
      fetchPages();
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      bsModal.current.hide();
      setPageToDelete(null);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/status`);
      toast.success('Status updated successfully');
      fetchPages();
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-3" style={{ color: '#ff4081' }}>Admin Dashboard</h2>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <button className="btn btn-success" onClick={() => navigate('/admin/create')}>
          Create New Page
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th>Logo</th>
              <th>Mail ID</th>
              <th>Contact</th>
              <th>Banner Image</th>
              <th>Header</th>
              <th>Text</th>
              <th>Address</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <tr key={page._id}>
                <td>
                  <img
                    src={`${API_BASE_URL}${page.logo}`}
                    alt="Logo"
                    className="img-fluid"
                    style={{ maxWidth: '80px' }}
                  />
                </td>
                <td>{page.mailId}</td>
                <td>{page.contact}</td>
                <td>
                  <img
                    src={`${API_BASE_URL}${page.bannerImage}`}
                    alt="Banner"
                    className="img-fluid"
                    style={{ maxWidth: '80px' }}
                  />
                </td>
                <td>{page.header}</td>
                <td>{page.text}</td>
                <td>{page.address}</td>
                <td>{page.isActive ? 'Yes' : 'No'}</td>
                <td>
                  <div className="d-flex flex-wrap gap-1">
                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/admin/edit/${page._id}`)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(page._id)}>Delete</button>
                    <button
                      className={`btn btn-sm ${page.isActive ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => handleToggleStatus(page._id)}
                    >
                      {page.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center">No pages found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true" ref={modalRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">Confirm Delete</h5>
              <button type="button" className="btn-close" onClick={() => bsModal.current.hide()} aria-label="Close" />
            </div>
            <div className="modal-body">
              Are you sure you want to delete this page?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
              <button type="button" className="btn btn-secondary" onClick={() => bsModal.current.hide()}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;