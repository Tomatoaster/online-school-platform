import React, { useState } from 'react';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function SubjectTable({ subjectList, setSubjectList, errorMsg, setErrorMsg }) {
  const [activeDesc, setActiveDesc] = useState('');
  const { authState, isAdmin, isTeacher } = useAuth();
  const { handleSubmit } = useForm();

  const onDelete = (deleteID) => {
    api
      .post(`deleteSubject?id=${deleteID}`)
      .then((response) => {
        setSubjectList((oldList) => oldList.filter((subject) => subject.SubjID !== response.data.SubjID));
      })
      .catch((error) => {
        if (error.response) {
          setErrorMsg(error.response.data);
        } else {
          setErrorMsg(`Could not delete assignment: ${error.message}`);
        }
      });
  };

  if (!authState.user) {
    return <h1 className="errormsg">Tantárgyak megjelenítéséhez jelentkezzen be!</h1>;
  }

  if (subjectList.length === 0) {
    return <h1 className="errormsg">Nincs megjelenítendő tantárgy!</h1>;
  }

  return (
    <div className="subjects">
      <table>
        <thead>
          <tr>
            <th id="headerID" onClick={() => setActiveDesc('')}>
              Tantárgy ID
            </th>
            <th>Tantárgy Név</th>
            <th>Felelős</th>
            <th>Feladatok</th>
            {(isAdmin() || isTeacher()) && <th>Meghívás</th>}
            {(isAdmin() || isTeacher()) && <th>Törlés</th>}
          </tr>
        </thead>
        <tbody>
          {subjectList.map((subject) => (
            <React.Fragment key={subject.SubjID}>
              <tr>
                <td className="idColumn" onClick={() => setActiveDesc(subject.SubjID)}>
                  {subject.SubjID}
                </td>
                <td>{subject.SubjName}</td>

                <td>{subject.UserID}</td>
                <td>
                  <Link to={`/showAssignments/${subject.SubjID}`}>
                    <button name="id" type="submit">
                      <p>Megtekint</p>
                    </button>
                  </Link>
                </td>
                {(isAdmin() || isTeacher()) && (
                  <td>
                    {(authState.user && authState.user.username === subject.UserID && (
                      <p className="prompt">
                        <Link to={`/inviteUsers/${subject.SubjID}`}>Ugrás</Link>
                      </p>
                    )) || <p className="noPermission">Nem jogosult!</p>}
                  </td>
                )}
                {(isAdmin() || isTeacher()) && (
                  <td>
                    {(((authState.user && authState.user.username === subject.UserID) || isAdmin()) && (
                      <form onSubmit={handleSubmit(() => onDelete(subject.SubjID))}>
                        <button name="delButton" type="submit">
                          <p>Töröl!</p>
                        </button>
                      </form>
                    )) || <p className="noPermission">Nem jogosult!</p>}
                  </td>
                )}
              </tr>
              {activeDesc === subject.SubjID && (
                <tr>
                  <td className="descRow" colSpan="5">
                    {subject.SubjDesc}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {errorMsg && <p className="ansMsg">{errorMsg}</p>}
    </div>
  );
}

SubjectTable.propTypes = {
  subjectList: PropTypes.array.isRequired,
  setSubjectList: PropTypes.func.isRequired,
  errorMsg: PropTypes.string.isRequired,
  setErrorMsg: PropTypes.func.isRequired,
};

export default SubjectTable;
