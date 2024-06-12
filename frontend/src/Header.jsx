import userLogo from './assets/user.png';
import useAuth from './hooks/useAuth.js';

function Header() {
  const { authState } = useAuth();

  return (
    <header>
      <a className="titleAnchor" href="/">
        Online Napló
      </a>

      <a href="/login">
        <div className="profile profileButton">{(authState.username && 'Kijelentkezés') || 'Bejelentkezés'}</div>
      </a>

      <div className="profile">
        <img src={userLogo} alt="user" />
        {authState.username || 'Guest'}
      </div>
      <nav>
        <a href="addSubject.html">
          <p>Tantárgy hozzáadása</p>
        </a>
      </nav>
    </header>
  );
}

export default Header;
