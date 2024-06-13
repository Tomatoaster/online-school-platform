import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

function InviteList() {
  const { authState } = useAuth();
  const [invites, setInvites] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api
      .get('getUserInvitations')
      .then((response) => {
        setInvites(response.data);
      })
      .catch((error) => {
        if (error.response) {
          setErrorMsg(error.response.data);
        }
      });
  }, []);

  const accept = (id) => {
    api
      .post('acceptInvitation', { subjID: id })
      .then((response) => {
        setErrorMsg(response.data);
      })
      .catch((err) => {
        if (err.response) {
          setErrorMsg(err.response.data);
        } else {
          setErrorMsg(err.message);
        }
      });
  };

  const refuse = (id) => {
    api
      .post('rejectInvitation', { subjID: id })
      .then((response) => {
        setErrorMsg(response.data);
      })
      .catch((err) => {
        if (err.response) {
          setErrorMsg(err.response.data);
        } else {
          setErrorMsg(err.message);
        }
      });
  };

  if (!authState.user) {
    return <></>;
  }

  if (invites.length === 0) {
    return (
      <div className="invites">
        <p className="prompt">Nincs olvasatlan meghívó</p>
      </div>
    );
  }

  return (
    <div className="invites">
      {errorMsg && <p className="prompt">{errorMsg}</p>}
      {invites.map((inv) => (
        <div key={`${inv.SubjID}-${inv.UserName}`} className="oneInvite">
          <div className="inviteText">Meghívást kaptál a {inv.SubjID} tantárgyhoz!</div>
          <div onClick={() => accept(inv.SubjID)} className="answer accept">
            &#10003;
          </div>
          <div onClick={() => refuse(inv.SubjID)} className="answer refuse">
            X
          </div>
        </div>
      ))}

      {/* <div className="oneInvite">
        <div className="inviteText">Meghívást kaptál a TANTARGY tantárgyhoz!</div>
        <div className="answer accept">&#10003;</div>
        <div className="answer refuse">X</div>
      </div>
      <div className="oneInvite">
        <div className="inviteText">Meghívást kaptál a TANTARGY tantárgyhoz!</div>
        <div className="answer accept">&#10003;</div>
        <div className="answer refuse">X</div>
      </div>
      <div className="oneInvite">
        <div className="inviteText">Meghívást kaptál a TANTARGY tantárgyhoz!</div>
        <div className="answer accept">&#10003;</div>
        <div className="answer refuse">X</div>
      </div> */}
    </div>
  );
}

export default InviteList;
