import Switch from '@mui/material/Switch';
import { HOME, LANGUAGE_IDX, USERINFO, initialUserInfo, languageList, levelArray } from '../util/constants';
import { UserInfo } from '../util/types';
import { ChangeEvent, useState } from 'react';
import { Box, Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, useMediaQuery } from '@mui/material';
import { menuWords } from '../util/menuWords';
import { settingChange } from '../network/userDetail';
import { useNavigate } from 'react-router-dom';
import CheckPasswordDialog from './CheckPasswordDialog';

export default function Setting() {
  const userInfo: UserInfo = JSON.parse(sessionStorage.getItem(USERINFO) || initialUserInfo)
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))
  const [language, setLanguage] = useState(languageIdx)
  const [auto, setAuto] = useState(userInfo.auto? userInfo.auto : false)
  const [level, setLevel] = useState(userInfo.level)
  const margin = 5
  const navigate = useNavigate()

  const handleAutoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAuto(e.target.checked);
  }

  const handleLanguageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLanguage(Number(e.target.value))
  }

  const handleLevelChange = (e: SelectChangeEvent) => {
    setLevel(Number(e.target.value))
  }

  async function handleSettingChange() {
    const update = await settingChange(language, level, auto)
    if (update) {
      alert(menuWords.modifiedNotice[language])
      navigate(HOME)
    }
  }

  return (
    <Box justifyContent="center" display="grid">
      <FormControl sx={{alignItems: "center"}}>
        <FormLabel id='language-handler' sx={{color: "inherit", mt: margin}}>{menuWords.language[language]}</FormLabel>
        <RadioGroup
          row
          aria-labelledby='language-handlers'
          name="language"
          value={language}
          onChange={handleLanguageChange}
          defaultValue={languageIdx}
          sx={{mb: margin, justifyContent: "center"}}
        >
          {languageList.map((lang, idx) => {
            return <FormControlLabel key={lang} value={idx} control={<Radio />} label={lang} />
          })}
        </RadioGroup>
        <FormControlLabel
        sx={{mb: margin}}
        control={
          <Switch
          checked={auto}
          onChange={handleAutoChange}
          inputProps={{ 'aria-label': 'controlled' }}
          />
        }
        label={menuWords.autoWord[language]}
        labelPlacement='start'
        >
        </FormControlLabel>
        <FormLabel sx={{color: "inherit"}} id="level-select-label">{menuWords.level[language]}</FormLabel>
        <Select
          sx={{width: "70%", mb: margin * 2}}
          labelId="level-select-label"
          id="level-select"
          value={String(level)}
          label={menuWords.level[language]}
          onChange={handleLevelChange}
          variant={"standard"}
        >
          {levelArray.map(level => {
            return <MenuItem key={level} value={level}>{Math.abs(level)}{level > 0? menuWords.K[language] : menuWords.D[language]}</MenuItem>
          })}
        </Select>
        <Button color='info' onClick={handleSettingChange} variant='contained' sx={{width: "100%", mb: margin * 2, textTransform: "none"}}>{menuWords.change[language]}</Button>
        <CheckPasswordDialog></CheckPasswordDialog>
      </FormControl>


    </Box>
  );
}