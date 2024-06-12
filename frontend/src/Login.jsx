import { useForm } from 'react-hook-form';
import api from './main.jsx';
import useAuth from './hooks/useAuth.js';

function Login() {
  const { authState, setAuthState } = useAuth();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (authState.username) {
      api.post('logout');
    } else {
      api
        .post('login', data)
        .then((response) => {
          setAuthState({ username: response.data.username, role: response.data.role });
          console.log(authState.username);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            console.error('Incorrect Username/Password!');
            // setErrorMessage();
          } else {
            console.error(`Something went wrong: ${error.message}`);
          }
        });
    }
  };

  return (
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
  );
}

export default Login;
