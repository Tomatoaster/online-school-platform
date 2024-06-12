import { useState, useEffect } from 'react';
import api from '../services/api';

function SubjectTable() {
  const [subjectList, setSubjectList] = useState([]);

  useEffect(() => {
    api
      .get('allSubjects')
      .then((response) => {
        setSubjectList(
          response.data.map((subject) => (
            <tr key={subject.SubjID}>
              <td className="idColumn">{subject.SubjID}</td>
              <td>{subject.SubjName}</td>

              <td>{subject.UserID}</td>
              <td>
                <form action="/showAssignments" method="GET">
                  <button name="id" value="<%= subject.SubjID %>" type="submit">
                    <p>Megtekint</p>
                  </button>
                </form>
              </td>
              <td>
                <form action="/deleteSubject?id={subject.SubjID}" method="POST">
                  <button name="delButton" type="submit">
                    <p>Töröl!</p>
                  </button>
                </form>
              </td>
            </tr>
          )),
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
            <th>Törlés</th>
          </tr>
        </thead>
        <tbody>{subjectList}</tbody>
      </table>
    </>
  );
}

export default SubjectTable;
