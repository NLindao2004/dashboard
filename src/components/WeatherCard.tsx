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
