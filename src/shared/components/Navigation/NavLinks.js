import './NavLinks.css';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth-context';

const NavLinks = props => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          All Users
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>My Places</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">New Place</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Login/Signup</NavLink>
        </li>
      )}
      {auth.isLoggedIn && <button onClick={auth.logout}>LOGOUT</button>}
    </ul>
  );
};

export default NavLinks;
