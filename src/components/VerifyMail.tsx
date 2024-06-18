import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyMail } from '../network/user';
import { HomeForm } from './HomeForm';
import { menuWords } from '../util/menuWords';
import { HOME, LANGUAGE_IDX } from '../util/constants';
import { LOGIN_PATH } from '../util/paths';

export default function VerifyMail() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))


  useEffect(() => {
    verifyMail(String(userId))
    .then(r => {
      if (r) {
        alert(menuWords.verificationCompleteNotice[languageIdx])
        navigate(HOME)
      } else {
        alert(menuWords.wrongApproachWarning[languageIdx])
        navigate(LOGIN_PATH)
      }
    })
    }, [userId])
    
  return (
    <Box>
      <HomeForm></HomeForm>
    </Box>
  );
}