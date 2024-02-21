import { Box, MenuItem, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NavButton } from "./NavButton";
import { HOME, LOGIN_PATH, PROBLEM_PATH, CREATE_PATH, SIGNUP_PATH, LANGUAGE_IDX, USERNAME } from "../../util/constants";
import Search from "../Search";
import UserMenu from "../UserMenu";
import { menuWords } from "../../util/menuWords";
import Language from "../Language";
import { Test } from "../Test";

export function PagesMenu() {
  const navigate = useNavigate();
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const isMobile = useMediaQuery("(max-width: 700px)")
  

  const problems = 
    <NavButton 
      key="problems" 
      onClick={() => navigate(`${PROBLEM_PATH}`)}
    >
      {menuWords.problems[languageIdx]}
    </NavButton>

  const create = 
    <NavButton 
      key="create" 
      onClick={() => navigate(`${CREATE_PATH}`)}
    >
      {menuWords.create[languageIdx]}
    </NavButton>

  return (
    <>
      <Typography sx={{
        fontWeight: 700,
        fontSize: isMobile? 20 : 30,
        textDecoration: "none",
        color: "inherit",
        mr: 5
      }}
      component="a"
      href={HOME}
      noWrap
      
      >
        GO-PROBLEM
      </Typography>

      <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
        {problems}
        <Search></Search>
        {create}
      </Box>
      <Box sx={{ flexGrow: 0, display: { xs: 'none', sm: 'flex' } }}>
        <Language></Language>
        <NavButton
          key={"signup"}
          onClick={() => navigate(`${SIGNUP_PATH}`)}
        >
          {menuWords.signup[languageIdx]}
        </NavButton>
        {localStorage.getItem(USERNAME)?
          <UserMenu></UserMenu>
          :
          <NavButton
            key={"login"}
            onClick={() => navigate(`${LOGIN_PATH}`)}
          >
            {menuWords.login[languageIdx]}
          </NavButton>}
      </Box>
      <Box sx={{ flexGrow: 1, display: {xs: "flex", sm: "none"}, justifyContent: "flex-end"}}>
        <Test></Test>
      </Box>
    </>
  )
}