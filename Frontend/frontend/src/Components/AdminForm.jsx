import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:5000/api/pages';

const AdminForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mailId: '',
    contact: '',
    header: '',
    text: '',
    address: '',
    isActive: true,
  });

  const [originalData, setOriginalData] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoChanged, setLogoChanged] = useState(false);
  const [bannerChanged, setBannerChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isUpdateEnabled, setIsUpdateEnabled] = useState(false);
  const prevUpdateEnabled = useRef(false);

  // Load existing page data if editing
  useEffect(() => {
    if (id) {
      axios.get(`${API_URL}/${id}`)
        .then(res => {
          const p = res.data;
          const loadedData = {
            mailId: p.mailId || '',
            contact: p.contact || '',
            header: p.header || '',
            text: p.text || '',
            address: p.address || '',
            isActive: p.isActive,
          };
          setFormData(loadedData);
          setOriginalData(loadedData);
          setLogoChanged(false);
          setBannerChanged(false);
          setLogoFile(null);
          setBannerFile(null);
          setIsUpdateEnabled(false);
          prevUpdateEnabled.current = false;
        })
        .catch(() => toast.error('Failed to load page data'));
    } else {
      setOriginalData(null);
      setIsUpdateEnabled(true);
      prevUpdateEnabled.current = true;
    }
  }, [id]);

  // Detect changes for enabling update button
  useEffect(() => {
    if (!originalData) {
      setIsUpdateEnabled(true);
      return;
    }

    const isDataChanged =
      formData.mailId !== originalData.mailId ||
      formData.contact !== originalData.contact ||
      formData.header !== originalData.header ||
      formData.text !== originalData.text ||
      formData.address !== originalData.address ||
      formData.isActive !== originalData.isActive ||
      logoChanged ||
      bannerChanged;

    setIsUpdateEnabled(isDataChanged);

    if (prevUpdateEnabled.current !== isDataChanged) {
      toast.info(isDataChanged ? 'Changes detected. You can update now.' : 'No changes detected. Update disabled.');
      prevUpdateEnabled.current = isDataChanged;
    }
  }, [formData, originalData, logoChanged, bannerChanged]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    setLogoChanged(!!file);
    setErrors(prev => ({ ...prev, logoFile: '' }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBannerFile(file);
    setBannerChanged(!!file);
    setErrors(prev => ({ ...prev, bannerFile: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.mailId.trim()) newErrors.mailId = 'Email ID is required';
    else if (!/\S+@\S+\.\S+/.test(formData.mailId)) newErrors.mailId = 'Invalid email format';

    if (!formData.contact.trim()) newErrors.contact = 'Contact No. is required';
    if (!formData.header.trim()) newErrors.header = 'Header is required';
    if (!formData.text.trim()) newErrors.text = 'Text is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    if (!id) {
      if (!logoFile) newErrors.logoFile = 'Logo image is required';
      if (!bannerFile) newErrors.bannerFile = 'Banner image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    if (id && !isUpdateEnabled) {
      toast.info('No changes detected to update');
      return;
    }

    const data = new FormData();
    data.append('mailId', formData.mailId);
    data.append('contact', formData.contact);
    data.append('header', formData.header);
    data.append('text', formData.text);
    data.append('address', formData.address);
    data.append('isActive', formData.isActive);

    if (logoFile) data.append('logo', logoFile);
    if (bannerFile) data.append('bannerImage', bannerFile);

    setLoading(true);

    try {
      if (id) {
        await axios.put(`${API_URL}/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Page updated successfully. Redirecting...', { autoClose: 2000 });
      } else {
        await axios.post(API_URL, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Page created successfully. Redirecting...', { autoClose: 2000 });
      }

      setTimeout(() => {
        navigate('/admin');
      }, 3000);

    } catch (error) {
      toast.error('Submit failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-3 p-md-4">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h2 className="mb-0" style={{ color: '#ff4081', fontSize: 'calc(1.2rem + 0.6vw)' }}>
            {id ? 'Edit Page' : 'Create New Page'}
          </h2>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              {/* Logo Upload */}
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold">Logo (Image Upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={`form-control form-control-lg ${errors.logoFile ? 'is-invalid' : ''}`}
                    onChange={handleLogoChange}
                  />
                  {id && !logoFile && (
                    <div className="form-text text-muted">Leave empty to keep existing logo</div>
                  )}
                  {errors.logoFile && <div className="invalid-feedback">{errors.logoFile}</div>}
                </div>
              </div>

              {/* Email ID */}
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold">Email ID</label>
                  <input
                    type="email"
                    name="mailId"
                    className={`form-control form-control-lg ${errors.mailId ? 'is-invalid' : ''}`}
                    value={formData.mailId}
                    onChange={handleChange}
                    required
                  />
                  {errors.mailId && <div className="invalid-feedback">{errors.mailId}</div>}
                </div>
              </div>

              {/* Contact No. */}
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold">Contact No.</label>
                  <input
                    type="text"
                    name="contact"
                    className={`form-control form-control-lg ${errors.contact ? 'is-invalid' : ''}`}
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                  {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
                </div>
              </div>

              {/* Banner Image */}
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold">Banner Image (Upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={`form-control form-control-lg ${errors.bannerFile ? 'is-invalid' : ''}`}
                    onChange={handleBannerChange}
                  />
                  {id && !bannerFile && (
                    <div className="form-text text-muted">Leave empty to keep existing banner image</div>
                  )}
                  {errors.bannerFile && <div className="invalid-feedback">{errors.bannerFile}</div>}
                </div>
              </div>

              {/* Header */}
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold">Header</label>
                  <input
                    type="text"
                    name="header"
                    className={`form-control form-control-lg ${errors.header ? 'is-invalid' : ''}`}
                    value={formData.header}
                    onChange={handleChange}
                    required
                  />
                  {errors.header && <div className="invalid-feedback">{errors.header}</div>}
                </div>
              </div>

              {/* Text */}
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold">Text</label>
                  <textarea
                    name="text"
                    className={`form-control form-control-lg ${errors.text ? 'is-invalid' : ''}`}
                    value={formData.text}
                    onChange={handleChange}
                    required
                    rows={1}
                  />
                  {errors.text && <div className="invalid-feedback">{errors.text}</div>}
                </div>
              </div>

              {/* Address */}
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label className="form-label fw-semibold">Address</label>
                  <input
                    type="text"
                    name="address"
                    className={`form-control form-control-lg ${errors.address ? 'is-invalid' : ''}`}
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
              </div>

              {/* Active Checkbox */}
              <div className="col-12 col-md-6">
                <div className="form-group d-flex align-items-center h-100">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      name="isActive"
                      className="form-check-input"
                      id="isActiveCheck"
                      checked={formData.isActive}
                      onChange={handleChange}
                      style={{ width: '2.5em', height: '1.5em' }}
                    />
                    <label htmlFor="isActiveCheck" className="form-check-label ms-2 fw-semibold">Active</label>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="col-12">
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2"
                    disabled={id ? (!isUpdateEnabled || loading) : loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {id ? 'Updating...' : 'Creating...'}
                      </>
                    ) : id ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 py-2"
                    onClick={() => navigate('/admin')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;