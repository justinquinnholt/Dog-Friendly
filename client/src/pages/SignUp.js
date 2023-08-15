import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import { BsArrowLeftShort } from 'react-icons/bs';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameErr, setUsernameErr] = useState('');
  const [password, setPassword] = useState('');
  const [errPwMessage, setErrPwMessage] = useState('');
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/login');
  };

  const handleUsername = (e) => {
    e.preventDefault();

    let checkUsername = e.target.value;
    setUsername(checkUsername);

    if (checkUsername === '') {
      setUsernameErr('username is required.');
    } else if (checkUsername.length < 6 || checkUsername.length > 30) {
      setUsernameErr('username should consist of 6 to 30 characters');
    } else if (!checkUsername.match(/^[A-Za-z]/)) {
      setUsernameErr(
        'username should start with at least one alphabetic character.'
      );
    } else if (!checkUsername.match(/\d/)) {
      setUsernameErr('username should contain at least one numbers.');
    } else if (!checkUsername.match(/_/)) {
      setUsernameErr('username should contain at least one underscore');
    } else {
      setUsernameErr('');
    }
  };

  const handlePassword = (e) => {
    e.preventDefault();

    let checkPassword = e.target.value;
    setPassword(checkPassword);

    if (checkPassword === '') {
      setErrPwMessage('Your password is required.');
    } else if (checkPassword.length < 8) {
      setErrPwMessage('Your password should be at least 8 characters long.');
    } else if (!checkPassword.match(/[A-Z]/)) {
      setErrPwMessage(
        'Your password should contain at least one uppercase letter.'
      );
    } else if (!checkPassword.match(/\d/)) {
      setErrPwMessage('Your password should contain at least one number.');
    } else if (!checkPassword.match(/[!@#$%^&*()]/)) {
      setErrPwMessage(
        'Your password should contain at least one special character like (!, @, #, $, %, ^, &, *, (, or )).'
      );
    } else {
      setErrPwMessage('');
    }
  };

  const handleSignUpSubmit = async (e) => {
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
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      await res.json();
      handleBackClick();
    } catch (err) {
      alert(`Error registering user: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <BsArrowLeftShort
        className="back-btn"
        size={24}
        onClick={handleBackClick}
      />
      <div className="signup-heading">
        <h4>Create an Account</h4>
      </div>
      <div className="row">
        <form onSubmit={handleSignUpSubmit}>
          <div className="input-row">
            <label>
              <input
                required
                name="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsername}
              />
              {usernameErr === '' ? usernameErr : <p>{usernameErr}</p>}
            </label>
          </div>
          <div className="input-row">
            <label>
              <input
                required
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePassword}
              />
              {errPwMessage === '' ? errPwMessage : <p>{errPwMessage}</p>}
            </label>
          </div>
          <div className="input-row">
            <button className="signup-btn" disabled={isLoading}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
