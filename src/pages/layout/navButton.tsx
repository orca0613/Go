import { Button, styled } from "@mui/material";

export const NavButton = styled(Button)(({ theme }) => ({
  py: 1,
  display: 'block',
  color: 'inherit',
  ':hover': {
    backgroundColor: 'white',
  },
  ':hover::after': {
    transform: 'scaleX(1)',
    transformOrigin: 'bottom center',
  },
  ':after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    transform: 'scaleX(0)',
    height: '2px',
    bottom: '0',
    left: '0',
    backgroundColor: theme.palette['primary'].main,
    transformOrigin: 'bottom center',
    transition: 'transform 0.25s ease-out',
  },
}))
