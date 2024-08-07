import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { NavButton } from './layout/NavButton';
import { menuWords } from '../util/menuWords';
import { HOME, LANGUAGE_IDX, mobileFontSize } from '../util/constants';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { getLanguageIdx } from '../util/functions';

export default function Language() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery("(max-width: 400px)")
  const languageIdx = getLanguageIdx()
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate()

  function setLanguageAndMoveHome(idx: string) {
    setAnchorEl(null)
    localStorage.setItem(LANGUAGE_IDX, idx)
    navigate(HOME)
  }

  return (
    <div>
      <NavButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{fontSize: isMobile? mobileFontSize : ""}}
      >
        {menuWords.language[languageIdx]}
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
        <MenuItem onClick={() => setLanguageAndMoveHome("0")}>ENGLISH</MenuItem>
        <MenuItem onClick={() => setLanguageAndMoveHome("1")}>한국어</MenuItem>
        <MenuItem onClick={() => setLanguageAndMoveHome("2")}>中文</MenuItem>
        <MenuItem onClick={() => setLanguageAndMoveHome("3")}>日本語</MenuItem>

      </Menu>
    </div>
  );
}