import React from 'react';
import { IconButton, Menu, MenuItem, Typography, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function HamburgerMenu(): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    handleClose(); // Cierra el menú
  };

  return (
    <Grid container alignItems="center">
      <Grid item>
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          sx={{
            '&:focus': {
              outline: 'none', 
              color: 'black',
              
            },
            
          }}
        >
          <MenuIcon sx={{ fontSize: 36 }}/>
        </IconButton>

      </Grid>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleScrollTo('card')}>
          <Typography variant="body1">Informacion Principal</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleScrollTo('grafica')}>
        <Typography variant="body1">Gráfica Meteorológica</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleScrollTo('tabla')}>
          <Typography variant="body1">Tabla de Clima</Typography>
        </MenuItem>
        
      </Menu>
    </Grid>
  );
}

export default HamburgerMenu;
