import { useEffect, useState } from 'react';
import SubjectTable from './SubjectTable';
import InviteList from './InviteList';
import api from '../services/api';

function MainPage() {
  const [subjectList, setSubjectList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const retrieveSubjects = () => {
    api
      .get('userSubjects')
      .then((response) => {
        setSubjectList(response.data);
      })
      .catch((err) => {
        setErrorMsg(err.message);
      });
  };

  useEffect(() => retrieveSubjects(), []);

  return (
    <>
      <InviteList syncSubjects={retrieveSubjects} />
      <SubjectTable
        subjectList={subjectList}
        setSubjectList={setSubjectList}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
    </>
  );
}

export default MainPage;
