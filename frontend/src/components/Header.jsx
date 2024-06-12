import userLogo from '../assets/user.png';
import useAuth from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';

function Header() {
  const { authState } = useAuth();
  console.log(authState);
  return (
    <header>
      <Link className="titleAnchor" to="/">
        Online Napló
      </Link>

      <Link to="/login">
        <div className="profile profileButton">
          {(authState.user && authState.user.username && 'Kijelentkezés') || 'Bejelentkezés'}
        </div>
      </Link>

      <div className="profile">
        <img src={userLogo} alt="user" />
        {(authState.user && authState.user.username) || 'Guest'}
      </div>
      <nav>
        {authState.user && ['teacher', 'admin'].includes(authState.user.role) && (
          <Link to="addSubject.html">
            <p>Tantárgy hozzáadása</p>
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
