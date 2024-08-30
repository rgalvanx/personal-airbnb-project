import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='navbar' style={{ listStyle: 'none'}}>
      <li className='home'style={{ listStyleType: 'none'}}>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && (
        <li className='icon' style={{ listStyleType: 'none'}}>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
