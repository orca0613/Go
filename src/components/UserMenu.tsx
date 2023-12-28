import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { NavButton } from '../pages/layout/NavButton';
import { logout } from '../util/functions';
import { menuWords } from '../util/menuWords';
import { LANGUAGE_IDX } from '../util/constants';

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate()

  function logoutAndMove() {
    setAnchorEl(null)
    logout()
    navigate("/")
  }

  function moveToMyPage() {
    setAnchorEl(null)
    navigate("/mypage")
  }

  return (
    <div>
      <NavButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {menuWords.myPage[languageIdx]}
      </NavButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={moveToMyPage}>{menuWords.myPage[languageIdx]}</MenuItem>
        <MenuItem onClick={logoutAndMove}>{menuWords.logout[languageIdx]}</MenuItem>
      </Menu>
    </div>
  );
}