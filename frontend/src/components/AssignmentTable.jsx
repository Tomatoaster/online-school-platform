import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';

function AssignmentTable() {
  const [assignmentList, setAssignmentList] = useState([]);
  const [subjectOwner, setSubjectOwner] = useState('');
  const { id } = useParams();
  const { authState, isOwner } = useAuth();

  useEffect(() => {
    api
      .get(`/showAssignments?id=${id}`)
      .then((response) => {
        // setAssignmentList(response.data.assignments);
        setSubjectOwner(response.data.owner);
        setAssignmentList([
          { AID: 5, SubjID: 'a', ADesc: 'Feladat leiras', FileName: 'assignment.pdf', DueDate: '2024-06-27' },
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  if (!authState.user) {
    return <h1 className="errormsg">Feladatok megjelenítéséhez jelentkezzen be!</h1>;
  }
  if (assignmentList.length === 0) {
    return <h1 className="errormsg">Nincs megjelenítendő feladat!</h1>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Feladat ID</th>
          <th>Tantárgy ID</th>
          <th>Feladat Leírása</th>
          <th>Filenév</th>
          <th>Határidő</th>
          {isOwner(subjectOwner, authState.user.username) && <th>Törlés</th>}
        </tr>
      </thead>
      <tbody>
        {assignmentList.map((assignment) => (
          <tr key={assignment.AID}>
            <td className="idColumn">{assignment.AID}</td>
            <td>{assignment.SubjID}</td>
            <td>{assignment.ADesc}</td>
            <td>{assignment.FileName}</td>
            <td>{assignment.DueDate}</td>
            {isOwner(subjectOwner, authState.user.username) && <td className="delAssignment">Törlés!</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AssignmentTable;
