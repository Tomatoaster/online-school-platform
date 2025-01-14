import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api.js';
import useAuth from '../hooks/useAuth.js';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const { authState, login, logout } = useAuth();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = (data) => {
    api
      .post('login', data)
      .then((response) => {
        login(response.data.token, response.data.user);
        navigate('/');
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setErrorMsg('Incorrect Username/Password!');
        } else {
          setErrorMsg(`Something went wrong: ${error.message}`);
        }
      });
  };

  useEffect(() => {
    if (authState.user) {
      logout();
    }
  }, [authState.user, logout]);

  return (
    <>
      <p className="prompt">
        Nincs fiókja? &nbsp;
        <Link to="/register">Regisztráljon most!</Link>
      </p>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <p className="title">Bejelentkezés</p>

        <div className="input-container ic1">
          <input
            type="text"
            className="input"
            {...register('username', { required: true })}
            id="formUsername"
            placeholder=" "
          />
          <div className="cut"></div>
          <label htmlFor="formUsername" className="placeholder">
            Felhasználónév
          </label>
        </div>

        <div className="input-container ic2">
          <input
            type="password"
            className="input"
            {...register('password', { required: true })}
            id="formPassword"
            placeholder=" "
          />
          <div className="cut"></div>
          <label htmlFor="formPassword" className="placeholder">
            Jelszó
          </label>
        </div>

        <button name="loginButton" className="submit" type="submit">
          Bejelentkezés!
        </button>
      </form>
      {errorMsg && <p className="ansMsg">{errorMsg}</p>}
    </>
  );
}

export default Login;
