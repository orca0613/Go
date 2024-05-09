import { Box, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NavButton } from "./NavButton";
import { HOME, LANGUAGE_IDX, USERINFO, SITE_NAME, mobileFontSize } from "../../util/constants";
import { menuWords } from "../../util/menuWords";
import Language from "../Language";
import { Menu } from "../Menu";
import { Filter, UserInfo } from "../../util/types";
import { getRangeByTier, getTier, ownStringify, resetSortingForm } from "../../util/functions";
import { CREATE_PATH, LOGIN_PATH, PROBLEM_PATH } from "../../util/paths";
import { initialUserInfo } from "../../util/initialForms";


export function PagesMenu() {
  const navigate = useNavigate();
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const isMobile = useMediaQuery("(max-width: 400px)")
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)

  function resetPageAndMove() {
    const tier = getTier(userInfo.level)
    const [low, high] = getRangeByTier(tier)
    const filter: Filter = {
      tier: tier,
      low: low,
      high: high,
      creator: ""
    }
    const F = ownStringify(filter)
    resetSortingForm(1, 0)
    navigate(`${PROBLEM_PATH}/${F}`)
  }
  

  const problems = 
    <NavButton 
      sx={{fontSize: isMobile? mobileFontSize : "", display: sessionStorage.getItem(USERINFO)? "" : "none"}}
      key="problems" 
      onClick={resetPageAndMove}
    >
      {menuWords.problems[languageIdx]}
    </NavButton>

  const create = 
    <NavButton 
      key="create" 
      onClick={() => navigate(`${CREATE_PATH}`)}
      sx={{display: sessionStorage.getItem(USERINFO)? "" : "none", fontSize: isMobile? mobileFontSize : ""}}
    >
      {menuWords.create[languageIdx]}
    </NavButton>

  return (
    <>
      <Typography sx={{
        fontWeight: 700,
        fontSize: isMobile? 15 : 20,
        textDecoration: "none",
        color: "inherit",
        mr: "2%"
      }}
      component="a"
      href={HOME}
      noWrap
      
      >
        {SITE_NAME}
      </Typography>

      <Box sx={{ flexGrow: 1, display: "flex" }}>
        {problems}
        {create}
      </Box>
      {sessionStorage.getItem(USERINFO)?
        <Menu ></Menu> : 
        <Box sx={{ flexGrow: 0, display: "flex" }}>
          <Language></Language>
          <NavButton
            key={"login"}
            onClick={() => navigate(`${LOGIN_PATH}`)}
            sx={{fontSize: isMobile? mobileFontSize : ""}}
          >
            {menuWords.login[languageIdx]}
          </NavButton>
        </Box>
      }
    </>
  )
}
