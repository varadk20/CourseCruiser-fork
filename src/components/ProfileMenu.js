// src/components/ProfileMenu.js
import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Avatar, Menu, MenuItem } from '@mui/material';

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    handleClose();
  };

  return (
    <div>
      <Avatar onClick={handleClick} style={{ cursor: 'pointer' }} />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
