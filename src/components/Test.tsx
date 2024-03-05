import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { NavButton } from './layout/NavButton';
import { CREATED, CREATE_PATH, LANGUAGE_IDX, LIKED, LOGIN_PATH, PROBLEM_PATH, SIGNUP_PATH, SOLVED, UNRESOLVED, USERINFO, initialUserInfo } from '../util/constants';
import { menuWords } from '../util/menuWords';
import { useNavigate } from 'react-router-dom';
import { Divider, Typography } from '@mui/material';
import { UserInfo } from '../util/types';

export function Test() {
  const [open, setOpen] = useState(false);
  const divider = <Divider orientation="horizontal" sx={{mt: 1, mb: 2, borderColor: "black" }} />
  const userInfo: UserInfo = JSON.parse(localStorage.getItem(USERINFO) || initialUserInfo)

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

  const created = 
    <NavButton 
      key="created" 
      onClick={() => navigate(`/mypage/${CREATED}`)}
    >
      {menuWords.created[languageIdx]}: {userInfo.created.length}
    </NavButton>

  const solved = 
    <NavButton 
      key="solved" 
      onClick={() => navigate(`/mypage/${SOLVED}`)}
    >
      {menuWords.solved[languageIdx]} : {userInfo.solved.length}
    </NavButton>
  const unresolved = 
    <NavButton 
      key="unresolved" 
      onClick={() => navigate(`/mypage/${UNRESOLVED}`)}
    >
      {menuWords.unresolved[languageIdx]} : {Math.max(userInfo.tried.length - userInfo.solved.length, 0)}
    </NavButton>
  const liked = 
    <NavButton 
      key="liked" 
      onClick={() => navigate(`/mypage/${LIKED}`)}
    >
      {menuWords.liked[languageIdx]} : {userInfo.liked.length}
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
          <Typography sx={{fontStyle: "bolder"}} textAlign="center">{userInfo.name}</Typography>
          <Typography sx={{fontStyle: "bolder"}} textAlign="center">{userInfo.point} P </Typography>
          <Typography sx={{fontStyle: "bolder"}} textAlign="center">{userInfo.level > 0? `${userInfo.level}${menuWords.K[languageIdx]}` : `${Math.abs(userInfo.level)}${menuWords.D[languageIdx]}`}</Typography>
          {divider}
          <ListItem>
            {created}
          </ListItem>
          <ListItem>
            {solved}
          </ListItem>
          <ListItem>
            {unresolved}
          </ListItem>
          <ListItem>
            {liked}
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
