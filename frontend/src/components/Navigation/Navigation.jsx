import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='navbar' style={{ listStyle: 'none'}}>
      <li className='left_nav'style={{ listStyleType: 'none'}}>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && (
          <li className='right_nav' style={{ listStyleType: 'none'}}>
            {sessionUser && <li><NavLink to='/spots/new' className='create_spot'>Create a spot</NavLink></li>}
            <ProfileButton user={sessionUser} />
          </li>
        )}
    </ul>
  );
}

export default Navigation;
