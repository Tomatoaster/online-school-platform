import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const { authState, login, logout } = useAuth();
  const { register, handleSubmit } = useForm();
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const onSubmit = (data) => {
    api
      .post('register', data)
      .then((response) => {
        login(response.data.token, response.data.user);
        navigate('/');
      })
      .catch((error) => {
        if (error.response) {
          setErrorMsg(error.response.data);
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
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <p className="title">Regisztráció</p>

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

        <div className="input-container ic2">
          <input
            type="password"
            className="input"
            {...register('password2', { required: true })}
            id="formPassword2"
            placeholder=" "
          />
          <div className="cut"></div>
          <label htmlFor="formPassword2" className="placeholder">
            Jelszó megerősítése
          </label>
        </div>

        <button name="loginButton" className="submit" type="submit">
          Regisztráció!
        </button>
      </form>
      {errorMsg && <p className="ansMsg">{errorMsg}</p>}
    </>
  );
}

export default Register;
