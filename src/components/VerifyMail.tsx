import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyMail } from '../network/user';
import { HomeForm } from './HomeForm';
import { menuWords } from '../util/menuWords';
import { LANGUAGE_IDX } from '../util/constants';

export default function VerifyMail() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const languageIdx = Number(localStorage.getItem(LANGUAGE_IDX))


  useEffect(() => {
    verifyMail(String(userId))
    .then(r => {
      if (r) {
        alert(menuWords.verificationCompleteNotice[languageIdx])
        navigate("/login")
      } else {
        alert(menuWords.wrongApproachWarning)
        navigate("/home")
      }
    })
    }, [userId])
    
  return (
    <Box>
      <HomeForm></HomeForm>
    </Box>
  );
}