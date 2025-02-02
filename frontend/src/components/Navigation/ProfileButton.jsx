import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
// import { FaUserCircle } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className='profile_button' onClick={toggleMenu}>
        <FaUser /> Profile
      </button>
      <ul className={ulClassName}  style={{ listStyleType: 'none' }}ref={ulRef}>
        {user ? (
          < div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', padding: '5px', borderRadius: '8px', position: 'relative', width: '120px'}} className='icon_button'>
            <li>Hello, {user.firstName}</li>
            <li className='last_li'>{user.email}</li>
            <Link
              className='manage_spots'
              to='/spots/current'
              onClick={toggleMenu}>Manage Spots
            </Link>
            <li className='logout_button'>
              <button  onClick={logout}>Log Out</button>
            </li>
          </div>
        ) : (
          <div className='drop-menu'>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
