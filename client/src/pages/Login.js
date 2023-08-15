import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { loadUserData, fetchAllServices, fetchOpenServices } from './data';
import { toast } from 'react-toastify';

const Login = ({ setAllServices, setOpenServices }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loadDataAndUpdateServices = async (setAllServices, setOpenServices) => {
    try {
      const userData = await loadUserData();
      if (userData.profileId) {
        await fetchAllServices(userData.profileId, setAllServices);
        await fetchOpenServices(userData.profileId, setOpenServices);
      }
    } catch (error) {
      console.error('Error loading data and updating services:', error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.target);
      const userData = Object.fromEntries(formData.entries());
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok || res.status === 401) {
        toast.error('Invalid login credentials. Please try again.', {
          position: 'bottom-center',
          autoClose: 2000,
        });
      } else {
        const { token } = await res.json();
        sessionStorage.setItem('token', token);
        await loadDataAndUpdateServices(setAllServices, setOpenServices);
        navigate('/profile');
      }
    } catch (err) {
      toast.error('Error signing in. Please try again later.', {
        position: 'bottom-center',
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-heading">
        <h4>Login to your Account</h4>
      </div>
      <div className="row">
        <form onSubmit={handleLoginSubmit}>
          <div className="input-row">
            <label>
              <input
                required
                name="username"
                type="text"
                placeholder="Username"
              />
            </label>
          </div>
          <div className="input-row">
            <label>
              <input
                required
                name="password"
                type="password"
                placeholder="Password"
              />
            </label>
          </div>
          <div className="input-row">
            <button className="signin-btn" disabled={isLoading}>
              Sign In
            </button>
          </div>
        </form>
        <div className="row">
          <Link to="/signup" className="signup-link-container">
            <p>
              Don't have an account? <span className="signup">Sign up</span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
