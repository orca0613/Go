import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Navbar } from "./navBar";



const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%" minHeight="88vh">
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Navbar />
        <Box flex={1}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;