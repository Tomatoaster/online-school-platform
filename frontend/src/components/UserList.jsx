import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

function UserList() {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [subjectOwner, setSubjectOwner] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const { authState, isOwner } = useAuth();

  const inviteOne = (name) => {
    api
      .post('inviteUser', { subjID: id, username: name })
      .then(() => {
        setErrorMsg(`Meghívó sikeresen elküldve ${name} számára!`);
      })
      .catch((error) => {
        if (error.response) {
          setErrorMsg(error.response.data);
        } else {
          setErrorMsg(error.message);
        }
      });
  };

  useEffect(() => {
    setLoading(true);
    api
      .get('getAllUsers')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setErrorMsg(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    api
      .get(`/showAssignments?id=${id}`)
      .then((response) => {
        setSubjectOwner(response.data.owner);
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  }, [id]);

  if (loading) {
    return <></>;
  }

  if (!authState.user || !isOwner(subjectOwner, authState.user.username)) {
    return <p className="ansMsg">Nincs joga diákokat hozzáadni a tantárgyhoz!</p>;
  }

  return (
    <>
      {errorMsg && <p className="ansMsg">{errorMsg}</p>}
      <table>
        <thead>
          <tr>
            <th>Felhasználó</th>
            <th>Meghívás</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.UserName != authState.user.username)
            .map((user) => (
              <tr key={user.UserID}>
                <td>{user.UserName}</td>
                <td onClick={() => inviteOne(user.UserName)}>Meghív!</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default UserList;
