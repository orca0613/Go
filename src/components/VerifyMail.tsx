import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyMail } from '../network/user';
import { HomeForm } from './HomeForm';

export default function VerifyMail() {
  const { userId } = useParams()
  const navigate = useNavigate()


  useEffect(() => {
    if (userId) {
      const result = verifyMail(userId)
      .then(r => {
        if (r) {
          alert("인증 되었습니다")
          navigate("/login")
        } else {
          alert("잘못된 접근입니다")
          navigate("/home")
        }
      })
    }
    }, [userId])
    
  return (
    <Box>
      <HomeForm></HomeForm>
    </Box>
  );
}