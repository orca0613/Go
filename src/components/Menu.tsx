import { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { NavButton } from './layout/NavButton';
import { CREATED, LANGUAGE_IDX, LIKED, SOLVED, UNRESOLVED, USERINFO, WITHQUESTIONS, mobileFontSize } from '../util/constants';
import { menuWords } from '../util/menuWords';
import { useNavigate } from 'react-router-dom';
import { UserInfo } from '../util/types';
import { getUserDetail } from '../network/userDetail';
import { Badge, Divider, Typography } from '@mui/material';
import { getNumberUnchecked } from '../network/message';
import { resetSortingForm } from '../util/functions';
import { LOGIN_PATH, MYPAGE_PATH } from '../util/paths';
import { initialUserInfo } from '../util/initialForms';

export function Menu() {
  const [open, setOpen] = useState(false);
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const level = userInfo.level
  const [unsolved, setUnsolved] = useState<number[]>([])
  const [unchecked, setUnchecked] = useState(0)
  const divider = <Divider orientation="horizontal" sx={{borderColor: "gray"}} />

  useEffect(() => {
    getUserDetail(userInfo.name)
    .then(r => {
      const newUserInfo: UserInfo = {
        ...userInfo,
        point: r.point,
        created: r.created,
        withQuestions: r.withQuestions,
        tried: r.tried,
        solved: r.solved,
        liked: r.liked,
        language:r.language,
        auto: r.auto
      }
      sessionStorage.setItem(USERINFO, JSON.stringify(newUserInfo))
      const newUnsolved = r.tried.filter(element => !r.solved.includes(element))
      setUnsolved(newUnsolved)
      getNumberUnchecked()
      .then(n => {
        setUnchecked(n)
      })
    })
  }, [open])



  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setOpen(open);
  };

  const buttonStyle = {
    fontSize: mobileFontSize,
    textTransform: "none",
  }

  function logoutAndMove() {
    sessionStorage.clear()
    navigate(LOGIN_PATH)
  }

  const navigate = useNavigate();
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))

  function resetPageAndMove(where: string) {
    resetSortingForm(1, 0)
    navigate(`${MYPAGE_PATH}/${where}`)
  }

  const created = 
    <NavButton 
      key="created" 
      onClick={() => resetPageAndMove(CREATED)}
      sx={buttonStyle}
    >
      {menuWords.created[languageIdx]}
    </NavButton>

  const solved = 
    <NavButton 
      key="solved" 
      onClick={() => resetPageAndMove(SOLVED)}
      sx={buttonStyle}
    >
      {menuWords.solved[languageIdx]}
    </NavButton>
  
  const unresolved = 
  <NavButton 
    key="unresolved" 
    onClick={() => resetPageAndMove(UNRESOLVED)}
    sx={buttonStyle}
  >
    {menuWords.unresolved[languageIdx]}
  </NavButton>

  const liked = 
  <NavButton 
    key="liked" 
    onClick={() => resetPageAndMove(LIKED)}
    sx={buttonStyle}
  >
    {menuWords.liked[languageIdx]}
  </NavButton>

  const message = 
  unchecked > 0?
  <Badge 
  badgeContent={unchecked} 
  color='error' 
  anchorOrigin={{ vertical: "top", horizontal: "right"}}
  >
    <NavButton 
      key="message" 
      onClick={() => navigate("/message")}
      sx={buttonStyle}
    >
      {menuWords.message[languageIdx]}
    </NavButton>
  </Badge>
  :
  <NavButton 
    key="message" 
    onClick={() => navigate("/message")}
    sx={buttonStyle}
  >
    {menuWords.message[languageIdx]}
  </NavButton>

  const withQuestions = 
  <Badge
  badgeContent={userInfo.withQuestions.length}
  color='error'
  anchorOrigin={{vertical: "top", horizontal: "right"}}
  >
    <NavButton 
    key="withQuestions" 
    onClick={() => resetPageAndMove(WITHQUESTIONS)}
    sx={buttonStyle}
  >
    {menuWords.requestsReceived[languageIdx]}
  </NavButton>

  </Badge>

  const logOut = 
  <NavButton 
    key="logout" 
    onClick={logoutAndMove}
    sx={buttonStyle}
  >
    {menuWords.logout[languageIdx]}
  </NavButton>

  const setting = 
  <NavButton 
    key="setting" 
    onClick={() => navigate("/setting")}
    sx={buttonStyle}
  >
    {menuWords.setting[languageIdx]}
  </NavButton>



  return (
    <div>
      <Badge
        badgeContent={userInfo.withQuestions.length + unchecked}
        color='error'
        anchorOrigin={{vertical: "top", horizontal: "right"}}
      >
      <IconButton
        onClick={toggleDrawer(true)}
        edge="end"
        color="inherit"
        aria-label="menu"
        size='small'
      >
        <MenuIcon />
      </IconButton>
      </Badge>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <List>
          <ListItem sx={{justifyContent: "center"}}>
            <Typography variant='button' sx={{textTransform: "none", color: "gray"}}>{userInfo.name}</Typography>
          </ListItem>
          <ListItem sx={{justifyContent: "center"}}>
            <Typography variant='button' sx={{textTransform: "none", color: "gray"}}>{`${Math.abs(level)}${level > 0? menuWords.K[languageIdx] : menuWords.D[languageIdx]} / ${userInfo.point} P`}</Typography>
          </ListItem>
          <ListItem sx={{justifyContent: "center"}}>
            {message}
          </ListItem>
          {divider}
          <ListItem sx={{display: userInfo.created.length? "" : "none", justifyContent: "center"}}>
            {created}
          </ListItem>
          <ListItem sx={{display: userInfo.solved.length? "" : "none", justifyContent: "center"}}>
            {solved}
          </ListItem>
          <ListItem sx={{display: unsolved.length? "" : "none", justifyContent: "center"}}>
            {unresolved}
          </ListItem>
          <ListItem sx={{display: userInfo.liked.length? "" : "none", justifyContent: "center"}}>
            {liked}
          </ListItem>
          <ListItem sx={{display: userInfo.withQuestions.length? "" : "none", justifyContent: "center"}}>
            {withQuestions}
          </ListItem>
          {divider}
          <ListItem sx={{justifyContent: "center"}}>
            {logOut}
          </ListItem>
          <ListItem sx={{justifyContent: "center"}}>
            {setting}
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
