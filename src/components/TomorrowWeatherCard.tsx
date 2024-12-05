import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface TomorrowWeatherCardProps {
  temperature: string; // Temperatura para mañana
  weatherName: string; // Descripción del clima (name del símbolo)
}

const TomorrowWeatherCard: React.FC<TomorrowWeatherCardProps> = ({ temperature, weatherName }) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" component="div" color="primary">
        Mañana
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        {weatherName}
      </Typography>
      <Typography variant="h3" component="div">
        {temperature} °C
      </Typography>
    </Paper>
  );
};

export default TomorrowWeatherCard;
