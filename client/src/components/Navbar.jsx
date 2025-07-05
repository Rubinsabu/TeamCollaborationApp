import React from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
  
    const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white flex items-center justify-between px-6 py-3">
      <h1 className="text-lg font-bold">CollabTool</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span>Hello, {user.name}</span>
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar