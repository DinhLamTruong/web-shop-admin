import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
// import UserAPI from '../API/UserAPI';
import { AuthContext } from '../Context/AuthContext';

import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);

  //   const { loading, error, dispatch } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);

  const url = 'https://asm-njs03-server.onrender.com/api/auth/admin/login';

  const fetchData = async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (response.status === 403) {
      setError('You are not authorized!');
      return <Navigate to={`/login`} />;
    }
    if (response.status === 422) {
      setError('Invalid email or password!');
      return <Navigate to={`/login`} />;
    }
    const data = await response.json();
    localStorage.setItem('id_user', data.details._id);
    dispatch({ type: 'LOGIN_SUCCESS', payload: data.details });
    // navigate('/');
    setRedirect(true);
  };

  const handleSubmit = () => {
    fetchData();
  };

  return (
    <div className="page-wrapper" style={{ display: 'block' }}>
      <div className="page-breadcrumb">
        <div className="row">
          <div className="login">
            <div className="heading">
              <h2>Sign in</h2>
              <form action="#">
                <div className="input-group input-group-lg">
                  <span className="input-group-addon">
                    <i className="fa fa-user"></i>
                  </span>
                  <input
                    id="email"
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-group input-group-lg">
                  <span className="input-group-addon">
                    <i className="fa fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <div style={{ color: 'red' }}>{error}</div>
                {redirect && <Navigate to={`/`} />}
                <button type="button" className="float" onClick={handleSubmit}>
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
