import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { NavButton } from './layout/NavButton';
import { CREATE_PATH, LANGUAGE_IDX, LOGIN_PATH, PROBLEM_PATH, SIGNUP_PATH, USERNAME } from '../util/constants';
import { menuWords } from '../util/menuWords';
import { useNavigate } from 'react-router-dom';
import Search from './Search';
import Language from './Language';
import UserMenu from './UserMenu';
import { Divider } from '@mui/material';

export function Test() {
  const [open, setOpen] = useState(false);
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "black" }} />

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setOpen(open);
  };

  const navigate = useNavigate();
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  const problems = 
    <NavButton 
      key="problems" 
      onClick={() => navigate(PROBLEM_PATH)}
    >
      {menuWords.problems[languageIdx]}
    </NavButton>

  const create = 
    <NavButton 
      key="create" 
      onClick={() => navigate(CREATE_PATH)}
    >
      {menuWords.create[languageIdx]}
    </NavButton>

  return (
    <div>
      <IconButton
        onClick={toggleDrawer(true)}
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{
          width: 50,
          height: 50,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <List>
          <ListItem>
            {problems}
          </ListItem>
          <ListItem>
            <Search></Search>
          </ListItem>
          <ListItem>
            {create}
          </ListItem>
          {divider}
          <ListItem>
            <Language></Language>
          </ListItem>
          <ListItem>
            <NavButton
            key={"signup"}
            onClick={() => navigate(SIGNUP_PATH)}
            >
              {menuWords.signup[languageIdx]}
            </NavButton>
          </ListItem>
          <ListItem>
            {localStorage.getItem(USERNAME)?
              <UserMenu></UserMenu> :
              <NavButton
              key={"login"}
              onClick={() => navigate(LOGIN_PATH)}
              >
              {menuWords.login[languageIdx]}
              </NavButton>
            }
          </ListItem>
        </List>
        
      </Drawer>
      {/* 내용 */}
    </div>
  );
}
