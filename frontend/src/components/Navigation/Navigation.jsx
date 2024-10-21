import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { FaHouseUser } from 'react-icons/fa';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='navbar' style={{ listStyle: 'none'}}>
      <li className='left_nav'style={{ listStyleType: 'none'}}>
        <NavLink className='title'to="/"><FaHouseUser className='home_icon' />HomeBnb</NavLink>
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
