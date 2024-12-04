import './App.css';
import Grid from '@mui/material/Grid2';
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import WeatherCard from './components/WeatherCard';
import Item from './components/Item';
import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"));

  const [items, setItems] = useState<Item[]>([]);
  const [humidityData, setHumidityData] = useState<number[]>([]);
  const [precipitationData, setPrecipitationData] = useState<number[]>([]);
  const [cloudsData, setCloudsData] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const [selectedVariable, setSelectedVariable] = useState<string>("humidity");

  const [weatherData, setWeatherData] = useState({
    temperature: '',
    weatherDescription: '',
    visibility: '',
    humidity: '',
    pressure: '',
    windSpeed: '',
    windDirection: '',
    windGust: '',
    cloudCoverage: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");

      let nowTime = new Date().getTime();

      if (!expiringTime || nowTime > parseInt(expiringTime)) {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=2f997379b9826ef9e1a4fb69507743af`
        );
        savedTextXML = await response.text();

        const hours = 0.01;
        const delay = hours * 3600000;
        const expiringTime = nowTime + delay;

        localStorage.setItem("openWeatherMap", savedTextXML);
        localStorage.setItem("expiringTime", expiringTime.toString());
      }

      if (savedTextXML) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, 'application/xml');

        // Datos para las tarjetas
        const temperature = parseFloat(xml.getElementsByTagName('temperature')[0]?.getAttribute('value') || '0').toFixed(1);
        const weatherDescription = xml.getElementsByTagName('symbol')[0]?.getAttribute('name') || '';
        const visibility = (parseFloat(xml.getElementsByTagName('visibility')[0]?.getAttribute('value') || '0') / 1000).toFixed(1) + ' km';
        const humidity = xml.getElementsByTagName('humidity')[0]?.getAttribute('value') + '%';
        const pressure = xml.getElementsByTagName('pressure')[0]?.getAttribute('value') + ' hPa';
        const windSpeed = xml.getElementsByTagName('windSpeed')[0]?.getAttribute('mps') + ' m/s';
        const windDirection = xml.getElementsByTagName('windDirection')[0]?.getAttribute('code') || '';
        const windGust = xml.getElementsByTagName('windGust')[0]?.getAttribute('gust') + ' m/s';
        const cloudCoverage = xml.getElementsByTagName('clouds')[0]?.getAttribute('value') + '%';

        setWeatherData({
          temperature,
          weatherDescription,
          visibility,
          humidity,
          pressure,
          windSpeed,
          windDirection,
          windGust,
          cloudCoverage,
        });

        // Datos para la tabla y el gráfico
        const times = xml.getElementsByTagName("time");
        const dataToItems: Item[] = [];
        const humidityValues: number[] = [];
        const precipitationValues: number[] = [];
        const cloudsValues: number[] = [];
        const labels: string[] = [];

        for (let i = 0; i < Math.min(6, times.length); i++) {
          const time = times[i];
          const dateStart = time.getAttribute("from") || "";
          const dateEnd = time.getAttribute("to") || "";
          const precipitation = time.getElementsByTagName("precipitation")[0]?.getAttribute("probability") || "0";
          const humidity = time.getElementsByTagName("humidity")[0]?.getAttribute("value") || "0";
          const clouds = time.getElementsByTagName("clouds")[0]?.getAttribute("all") || "0";

          dataToItems.push({ dateStart, dateEnd, precipitation, humidity, clouds });
          humidityValues.push(parseFloat(humidity));
          precipitationValues.push(parseFloat(precipitation));
          cloudsValues.push(parseFloat(clouds));
          labels.push(dateStart);
        }

        setItems(dataToItems);
        setHumidityData(humidityValues);
        setPrecipitationData(precipitationValues);
        setCloudsData(cloudsValues);
        setTimeLabels(labels);
      }
    };

    fetchData();
  }, [owm]);

  return (
    <Grid container spacing={5}>
      {/* Tarjetas */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid size={6}>
          <WeatherCard
            title="Clima"
            subtitle={weatherData.weatherDescription}
            mainValue={weatherData.temperature}
            mainUnit="°C"
            description="Sobre el clima de hoy"
            details={[
              { label: 'Visibilidad', value: weatherData.visibility },
              { label: 'Humedad', value: weatherData.humidity },
              { label: 'Presión', value: weatherData.pressure },
            ]}
          />
        </Grid>
        <Grid size={6}>
          <WeatherCard
            title="Viento"
            subtitle="Gentle Breeze"
            mainValue={weatherData.windSpeed}
            mainUnit="m/s"
            description="Sobre el viento de hoy"
            details={[
              { label: 'Ráfaga', value: weatherData.windGust },
              { label: 'Dirección', value: weatherData.windDirection },
              { label: 'Nubes', value: weatherData.cloudCoverage },
            ]}
          />
        </Grid>
      </Grid>

      {/* Tabla */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, xl: 4 }}>
          <ControlWeather
            selectedVariable={selectedVariable}
            onVariableChange={setSelectedVariable}
          />
        </Grid>
        {/* Gráfico */}
        <Grid size={{ xs: 12, xl: 4 }}>
          <LineChartWeather
            selectedVariable={selectedVariable}
            humidityData={humidityData}
            precipitationData={precipitationData}
            cloudsData={cloudsData}
            timeLabels={timeLabels}
          />
        </Grid>
        <Grid size={{ xs: 12, xl: 4 }}>
          <TableWeather itemsIn={items} />
        </Grid>
      </Grid>

    </Grid>
  );
}

export default App;
