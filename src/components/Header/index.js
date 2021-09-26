import React from 'react';
import {
  FaHome,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserAlt,
  FaCircle,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Nav } from './styled';
import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';

export default function Header() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(actions.loginFailure());
    history.push('/');
  };

  return (
    <>
      <Nav>
        <Link to="/">
          <FaHome size={24} />
        </Link>
        <Link to="/register">
          <FaUserAlt size={24} />
        </Link>
        {isLoggedIn ? (
          <Link onClick={handleLogout} to="/Logout">
            <FaSignOutAlt size={24} />
          </Link>
        ) : (
          <Link to="/Login">
            <FaSignInAlt size={24} />
          </Link>
        )}
        {isLoggedIn && <FaCircle size={24} color="#66ff33" />}
      </Nav>
    </>
  );
}
