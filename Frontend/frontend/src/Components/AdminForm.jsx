import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const API_BASE_URL = 'http://localhost:5000'; // Local development URL
const API_BASE_URL = 'https://payplex-assignment-task-backend.onrender.com';
const API_URL = `${API_BASE_URL}/api/pages`;

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
    
    // For contact field, only allow numbers and limit to 10 digits
    if (name === 'contact') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
    
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
    else if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = 'Contact No. must be exactly 10 digits';

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
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h2 className="mb-0" style={{ color: '#ff4081', fontSize: 'calc(1.2rem + 0.6vw)' }}>
            {id ? 'Edit Page' : 'Create New Page'}
          </h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label fw-semibold">Logo (Image Upload)</label>
                <input
                  type="file"
                  accept="image/*"
                  className={`form-control form-control-lg ${errors.logoFile ? 'is-invalid' : ''}`}
                  onChange={handleLogoChange}
                />
                {id && !logoFile && <div className="form-text text-muted">Leave empty to keep existing logo</div>}
                {errors.logoFile && <div className="invalid-feedback">{errors.logoFile}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email ID</label>
                <input
                  type="email"
                  name="mailId"
                  placeholder="Enter email address"
                  className={`form-control form-control-lg ${errors.mailId ? 'is-invalid' : ''}`}
                  value={formData.mailId}
                  onChange={handleChange}
                />
                {errors.mailId && <div className="invalid-feedback">{errors.mailId}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Contact No.</label>
                <input
                  type="text"
                  name="contact"
                  placeholder="Enter 10 digit contact number"
                  className={`form-control form-control-lg ${errors.contact ? 'is-invalid' : ''}`}
                  value={formData.contact}
                  onChange={handleChange}
                />
                {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Banner Image (Upload)</label>
                <input
                  type="file"
                  accept="image/*"
                  className={`form-control form-control-lg ${errors.bannerFile ? 'is-invalid' : ''}`}
                  onChange={handleBannerChange}
                />
                {id && !bannerFile && <div className="form-text text-muted">Leave empty to keep existing banner</div>}
                {errors.bannerFile && <div className="invalid-feedback">{errors.bannerFile}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Header</label>
                <input
                  type="text"
                  name="header"
                  placeholder="Enter header title"
                  className={`form-control form-control-lg ${errors.header ? 'is-invalid' : ''}`}
                  value={formData.header}
                  onChange={handleChange}
                />
                {errors.header && <div className="invalid-feedback">{errors.header}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Text</label>
                <textarea
                  name="text"
                  placeholder="Enter main content text"
                  className={`form-control form-control-lg ${errors.text ? 'is-invalid' : ''}`}
                  value={formData.text}
                  onChange={handleChange}
                />
                {errors.text && <div className="invalid-feedback">{errors.text}</div>}
              </div>

              <div className="col-md-12">
                <label className="form-label fw-semibold">Address</label>
                <textarea
                  name="address"
                  placeholder="Enter full address"
                  className={`form-control form-control-lg ${errors.address ? 'is-invalid' : ''}`}
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>

              <div className="col-12">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="isActive">Is Active</label>
                </div>
              </div>

              <div className="col-12 text-end">
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={loading || (id ? !isUpdateEnabled : false)}
                >
                  {loading ? 'Saving...' : id ? 'Update Page' : 'Create Page'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;