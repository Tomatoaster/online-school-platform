import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useForm } from 'react-hook-form';

function AssignmentTable() {
  const [assignmentList, setAssignmentList] = useState([]);
  const [subjectOwner, setSubjectOwner] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { id } = useParams();
  const { authState, isOwner } = useAuth();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('hwSubject', id);
    formData.append('hwDesc', data.hwDesc);
    formData.append('dueDate', data.dueDate);
    formData.append('hwFile', data.hwFile[0]);

    api
      .post('addAssignment', formData)
      .then((response) => {
        setAssignmentList((oldList) => [...oldList, response.data]);
      })
      .catch((error) => {
        if (error.response) {
          setErrorMsg(error.response.data);
        } else {
          setErrorMsg(`Something went wrong: ${error.message}`);
        }
      });
  };

  const onDelete = (hwID) => {
    api
      .post(`removeAssignment?id=${hwID}`)
      .then(() => {
        setAssignmentList((oldList) => oldList.filter((oldHw) => oldHw.AID != hwID));
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
    api
      .get(`/showAssignments?id=${id}`)
      .then((response) => {
        setAssignmentList(response.data.assignments);
        setSubjectOwner(response.data.owner);
        // setAssignmentList([
        //   { AID: 5, SubjID: 'a', ADesc: 'Feladat leiras', FileName: 'assignment.pdf', DueDate: '2024-06-27' },
        // ]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  if (!authState.user) {
    return <h1 className="errormsg">Feladatok megjelenítéséhez jelentkezzen be!</h1>;
  }

  return (
    <>
      {(assignmentList.length > 0 && (
        <>
          <h1>{`${id} tantárgy feladatai:`}</h1>
          <table>
            <thead>
              <tr>
                <th>Feladat ID</th>
                <th>Feladat Leírása</th>
                <th>Filenév</th>
                <th>Határidő</th>
                {isOwner(subjectOwner, authState.user.username) && <th>Törlés</th>}
              </tr>
            </thead>
            <tbody>
              {assignmentList.map((assignment) => (
                <tr key={assignment.FileName}>
                  <td>{assignment.AID}</td>
                  <td>{assignment.ADesc}</td>
                  <td>{assignment.FileName}</td>
                  {(new Date(assignment.DueDate) > new Date() && <td>{assignment.DueDate}</td>) || (
                    <td className="noPermission">{assignment.DueDate}</td>
                  )}
                  {isOwner(subjectOwner, authState.user.username) && (
                    <td className="delAssignment" onClick={() => onDelete(assignment.AID)}>
                      Törlés!
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )) || <h1 className="errormsg">Nincs megjelenítendő feladat!</h1>}

      {errorMsg && <p className="ansMsg">{errorMsg}</p>}

      {isOwner(subjectOwner, authState.user.username) && (
        <form className="form" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <p className="title">Feladat létrehozása</p>

          <div className="textarea ic2">
            <textarea
              id="hwDesc"
              className="input input-area"
              {...register('hwDesc', { required: true })}
              placeholder=" "
            ></textarea>
            <div className="cut"></div>
            <label htmlFor="hwDesc" className="placeholder">
              Feladat leírása
            </label>
          </div>
          <p className="subtitle">Határidő:</p>
          <div className="input-container">
            <input type="date" className="input" {...register('dueDate', { required: true })} id="dueDate" />
          </div>
          <p className="subtitle">Specifikáció:</p>
          <div className="input-container">
            <input
              type="file"
              className="input"
              accept="application/pdf"
              {...register('hwFile', { required: true })}
              id="hwFile"
            />
          </div>
          <button name="submitButton" className="submit" type="submit">
            Feltölt!
          </button>
        </form>
      )}
    </>
  );
}

export default AssignmentTable;
