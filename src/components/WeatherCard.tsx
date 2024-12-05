import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';

interface WeatherCardProps {
  title: string;
  subtitle: string;
  mainValue: string;
  mainUnit: string;
  description: string;
  details: { label: string; value: string }[];
}

export default function WeatherCard({
  title,
  subtitle,
  mainValue,
  mainUnit,
  description,
  details,
}: WeatherCardProps) {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 2,
        backgroundImage: 'url("https://i.pinimg.com/736x/5c/f3/86/5cf38662a2adf089d77a56f3d1e5c2c8.jpg")', // URL de la imagen
        backgroundSize: 'cover', // Ajustar imagen para cubrir todo
        backgroundPosition: 'center', // Centrar la imagen
        color: '#ffffff', // Cambiar el color del texto a blanco para mejor contraste
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Sombra
      }}
    >
      <Typography variant="h6" color="primary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        {subtitle}
      </Typography>
      <Typography variant="h3" component="div">
        {mainValue} <span style={{ fontSize: '1rem' }}>{mainUnit}</span>
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {description}
      </Typography>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {details.map((detail, index) => (
          <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
            <Typography variant="body2" color="textSecondary">
              {detail.label}
            </Typography>
            <Typography variant="subtitle1">{detail.value}</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
