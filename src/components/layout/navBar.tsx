import { AppBar, Toolbar } from '@mui/material';
import { PagesMenu } from './pagesMenu';

export function Navbar() {
  return (
    <AppBar position="static" color='transparent'>
      <Toolbar disableGutters sx={{ px: { xs: '5px', md: '15px' } }}>
        <PagesMenu />
      </Toolbar>
    </AppBar>
  );
}