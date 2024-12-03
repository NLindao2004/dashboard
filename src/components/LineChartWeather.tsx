import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';

interface LineChartWeatherProps {
  humidityData: number[];
  timeLabels: string[];
}

export default function LineChartWeather({ humidityData, timeLabels }: LineChartWeatherProps) {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LineChart
        width={400}
        height={250}
        series={[
          { data: humidityData, label: 'Humedad' },
        ]}
        xAxis={[{ scaleType: 'point', data: timeLabels }]}
      />
    </Paper>
  );
}
