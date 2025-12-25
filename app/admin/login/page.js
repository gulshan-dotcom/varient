'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/stylesheets/admin/login.css';

const Page = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    secret: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      toast.success(data.message, {
        position: 'top-right',
        autoClose: 3000,
      });
      console.log("redirectiong")
      router.push('/admin/dashboard');
    } catch (err) {
      toast.error(err.message, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Admin Login</h1>
          <p>Access the admin dashboard to manage trips</p>
        </div>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email-input">
              <i className="ri-mail-line"></i> Email
            </label>
            <input
              type="email"
              id="email-input"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password-input">
              <i className="ri-lock-line"></i> Password
            </label>
            <input
              type="password"
              id="password-input"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="secret-input">
              <i className="ri-shield-keyhole-line"></i> Admin Secret
            </label>
            <input
              type="text"
              id="secret-input"
              name="secret"
              value={formData.secret}
              onChange={handleInputChange}
              required
              placeholder="Enter admin secret code"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
            <i className="ri-login-box-line"></i>
          </button>
        </form>
      </div>
      <ToastContainer />
    </main>
  );
};

export default Page;