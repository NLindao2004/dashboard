import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';

interface WeatherCardProps {
  title: string;
  subtitle: string;
  mainValue: string;
  mainUnit?: string;
  description: string;
  details: { label: string; value: string }[];
  imageUrl?: string; // Nueva prop opcional para la URL de la imagen
  loading?: boolean; // Nueva prop para el estado de carga
}

export default function WeatherCard({
  title,
  subtitle,
  mainValue,
  mainUnit,
  description,
  details,
  imageUrl,
  loading = false, // Por defecto, no está cargando
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
        backgroundImage: !loading && imageUrl
          ? `url(${imageUrl})`
          : `url('https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/default.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      {loading ? (
        <>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton variant="rectangular" width="80%" height={60} />
          <Skeleton variant="text" width="50%" height={30} />
          <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
            {[...Array(3)].map((_, index) => (
              <Grid
                key={index}
                size={{ xs: 2, sm: 4, md: 4 }}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  padding: '16px',
                  borderRadius: '8px',
                }}
              >
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={15} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <>
          <Typography variant="h2" color="black" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" color="black" gutterBottom>
            {subtitle}
          </Typography>
          <Typography variant="h3" component="div" color="black">
            {mainValue} <span style={{ fontSize: '1rem' }}>{mainUnit}</span>
          </Typography>
          <Typography variant="h5" color="black" gutterBottom>
            {description}
          </Typography>
          <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
            {details.map((detail, index) => (
              <Grid
                key={index}
                size={{ xs: 2, sm: 4, md: 4 }}
                sx={{
                  backgroundColor: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                }}
              >
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ width: '100px', fontWeight: 'bold' }}
                >
                  {detail.label}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ width: '100px', color: 'black' }}
                >
                  {detail.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Paper>
  );
}
