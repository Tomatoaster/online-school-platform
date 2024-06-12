import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function AddSubject() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { isTeacher, isAdmin } = useAuth();

  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = (data) => {
    api
      .post('addSubject', data)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        if (error.response) {
          setErrorMsg(error.response.data);
        } else {
          setErrorMsg(error.message);
        }
      });
  };

  if (!isTeacher() && !isAdmin()) {
    return <p className="ansMsg">You do not have permission!</p>;
  }

  return (
    <>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <p className="title">Tantárgy hozzáadása</p>

        <div className="input-container ic1">
          <input
            type="text"
            className="input"
            {...register('subjectId', { required: true })}
            id="newSubject"
            placeholder=" "
          />
          <div className="cut"></div>
          <label htmlFor="subjectId" className="placeholder">
            Tantárgy ID
          </label>
        </div>

        <div className="input-container ic2">
          <input
            type="text"
            className="input"
            {...register('subjName', { required: true })}
            id="subjName"
            placeholder=" "
          />
          <div className="cut"></div>
          <label htmlFor="subjName" className="placeholder">
            Tantárgy neve
          </label>
        </div>

        <div className="textarea ic2">
          <textarea
            className="input input-area"
            {...register('subjDesc', { required: true })}
            id="subjDesc"
            placeholder=" "
          ></textarea>
          <div className="cut"></div>
          <label htmlFor="subjDesc" className="placeholder">
            Tantárgy leírása
          </label>
        </div>

        <button name="submitButton" className="submit" type="submit">
          Létrehoz!
        </button>
      </form>
      {errorMsg && <p className="ansMsg">Could not add subject: {errorMsg}</p>}
    </>
  );
}

export default AddSubject;
