import { Box, Button, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NavButton } from "./NavButton";
import { HOME, USERINFO, mobileFontSize } from "../../util/constants";
import { menuWords } from "../../util/menuWords";
import Language from "../Language";
import { Menu } from "../Menu";
import { FilterForm, UserInfo } from "../../util/types";
import { getLanguageIdx, getTier, ownStringify, resetSortingForm } from "../../util/functions";
import { CREATE_PATH, LOGIN_PATH, PROBLEM_PATH } from "../../util/paths";
import { initialUserInfo } from "../../util/initialForms";


export function PagesMenu() {
  const navigate = useNavigate();
  const languageIdx = getLanguageIdx()
  const isMobile = useMediaQuery("(max-width: 400px)")
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)

  function resetPageAndMove() {
    const tier = getTier(userInfo.level)
    const filter: FilterForm = {
      tier: tier,
      level: 0,
      creator: ""
    }
    const F = ownStringify(filter)
    sessionStorage.setItem("initFilter", F)
    resetSortingForm(1, 0)
    navigate(`${PROBLEM_PATH}/${F}`)
  }

  const logo = 
  <img src="/AppIcon.png" alt="logo" width="50" height="50"/>
  const roundLogo = 
  <img src="/AppIcon-round.png" alt="logo" width="50" height="50"/>
  

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
      <Button sx={{
        padding: 1,
      }}
      onClick={() =>navigate(HOME)}
      >
        {roundLogo}
      </Button>

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
