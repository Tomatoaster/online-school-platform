import { useState, useEffect } from 'react';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

function SubjectTable() {
  const [subjectList, setSubjectList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const { authState, isAdmin, isTeacher } = useAuth();
  const { handleSubmit } = useForm();

  const onDelete = (deleteID) => {
    api
      .post(`deleteSubject?id=${deleteID}`)
      .then((response) => {
        setSubjectList(subjectList.filter((subject) => subject.SubjID !== response.data.SubjID));
      })
      .catch((error) => {
        if (error.response) {
          setErrorMsg(error.response.data);
        } else {
          setErrorMsg(`Could not delete assignment: ${error.message}`);
        }
      });
  };

  useEffect(() => {
    api
      .get('allSubjects')
      .then((response) => {
        // setSubjectList([{ SubjID: 'asd', SubjName: 'Tantargy', UserID: 'Tanar1', SubjDesc: 'Leiras' }]);
        setSubjectList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!authState.user) {
    return <h1 className="errormsg">Tantárgyak megjelenítéséhez jelentkezzen be!</h1>;
  }

  if (subjectList.length === 0) {
    return <h1 className="errormsg">Nincs megjelenítendő tantárgy!</h1>;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th id="headerID">Tantárgy ID</th>
            <th>Tantárgy Név</th>
            <th>Felelős</th>
            <th>Feladatok</th>
            {(isAdmin() || isTeacher()) && <th>Törlés</th>}
          </tr>
        </thead>
        <tbody>
          {subjectList.map((subject) => (
            <tr key={subject.SubjID}>
              <td className="idColumn">{subject.SubjID}</td>
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
          ))}
        </tbody>
      </table>

      {errorMsg && <p className="ansMsg">{errorMsg}</p>}
    </>
  );
}

export default SubjectTable;
