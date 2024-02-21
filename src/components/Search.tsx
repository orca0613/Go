import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { NavButton } from './layout/NavButton';
import { menuWords } from '../util/menuWords';
import { LANGUAGE_IDX } from '../util/constants';

export default function Search() {
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

  function moveSearchCreator() {
    setAnchorEl(null)
    navigate("/search-creator")
  }

  function moveSearchLevel() {
    setAnchorEl(null)
    navigate("/search-level")
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
        {menuWords.search[languageIdx]}
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
        <MenuItem onClick={moveSearchCreator}>{menuWords.creator[languageIdx]}</MenuItem>
        <MenuItem onClick={moveSearchLevel}>{menuWords.level[languageIdx]}</MenuItem>
      </Menu>
    </div>
  );
}