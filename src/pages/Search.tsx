import { Box, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"


function Search() {
  const navigate = useNavigate()
  const movePage = (address: string) => {
    navigate(address)
  }
  return (
    <Box alignItems="center">
      <Box sx={{mt: 20}} textAlign="center">
        <Button sx={{width: 200, height: 200, fontSize: 20, borderRadius: 5, margin: 5}} onClick={() => movePage("creator")}>creator</Button>
        <Button sx={{width: 200, height: 200, fontSize: 20, borderRadius: 5, margin: 5}} onClick={() => movePage("level")}>level</Button>
      </Box>
    </Box>
  )
}

export default Search