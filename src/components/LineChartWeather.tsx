import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';

interface LineChartWeatherProps {
  selectedVariable: string; // Variable seleccionada
  humidityData: number[]; // Datos de humedad
  precipitationData: number[]; // Datos de precipitación
  cloudsData: number[]; // Datos de nubosidad
  timeLabels: string[]; // Etiquetas de tiempo
}

export default function LineChartWeather({
  selectedVariable,
  humidityData,
  precipitationData,
  cloudsData,
  timeLabels,
}: LineChartWeatherProps) {
  // Determinar los datos y la etiqueta de la serie
  let data: number[] = [];
  let label: string = '';

  switch (selectedVariable) {
    case 'precipitation':
      data = precipitationData;
      label = 'Precipitación';
      break;
    case 'clouds':
      data = cloudsData;
      label = 'Nubosidad';
      break;
    case 'humidity':
    default:
      data = humidityData;
      label = 'Humedad';
      break;
  }

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LineChart
        width={800}
        height={300}
        series={[{ data, label }]} // Datos dinámicos basados en la selección
        xAxis={[{ scaleType: 'point', data: timeLabels }]} // Etiquetas de tiempo
      />
    </Paper>
  );
}
