import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface TomorrowWeatherCardProps {
  imageUrl?: string; // Nueva prop opcional para la URL de la imagen

}

const TomorrowWeatherCard: React.FC<TomorrowWeatherCardProps> = ({ imageUrl }) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', // Centra el contenido verticalmente
        textAlign: 'center',
        width: 'auto', //290
        height: 'auto',
        backgroundImage: imageUrl
        ? `url(${imageUrl})`
        : `url('https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/Lluvia.webp')`, // Usamos la imagen si se proporciona
        backgroundSize: 'cover', // Ajustar imagen para cubrir todo
        backgroundPosition: 'center', // Centrar la imagen
        color: '#ffffff', // Cambiar el color del texto a blanco para mejor contraste
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Sombra
      }}
    >

      <Typography
        variant="h2"
        component="div"
        color="black"
        sx={{ margin: '8px 0', position: 'relative', top: 'auto' }}
      >
        Mañana
      </Typography>


    </Paper>
  );
};

export default TomorrowWeatherCard;
