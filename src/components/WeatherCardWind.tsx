import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';

interface WeatherCardProps {
  title: string;
  subtitle: string;
  mainValue: string;
  mainUnit?: string;
  description: string;
  details: { label: string; value: string }[];
  imageUrl?: string; // Nueva prop opcional para la URL de la imagen

}

export default function WeatherCard({
  title,
  subtitle,
  mainValue,
  mainUnit,
  description,
  details,
  imageUrl,
}: WeatherCardProps) {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        height: '400px',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 2,
        backgroundImage: imageUrl
          ? `url(${imageUrl})`
          : `url('https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/defaultWind.webp')`, // Usamos la imagen si se proporciona
        backgroundSize: 'cover', // Ajustar imagen para cubrir todo
        backgroundPosition: 'center', // Centrar la imagen
        color: '#ffffff', // Cambiar el color del texto a blanco para mejor contraste
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Sombra
      }}
    >
      <Typography variant="h2" color="black" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" color="black" gutterBottom>
        {subtitle}
      </Typography>
      <Typography variant="h3" component="div" color='black'>
        {mainValue} <span style={{ fontSize: '1rem' }}>{mainUnit}</span>
      </Typography>
      <Typography variant="h5" color="black" gutterBottom  >
        {description}
      </Typography>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {details.map((detail, index) => (
          <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }} sx={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
            <Typography variant="body1" color="textSecondary" sx={{ width: '100px', fontWeight: 'bold' }}  >
              {detail.label}
            </Typography>
            <Typography variant="subtitle1" sx={{ width: '100px', color: 'black' }}  >{detail.value}</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
