import './App.css';
import Grid from '@mui/material/Grid2';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import WeatherCardWind from './components/WeatherCardWind';
import LineChartWeather from './components/LineChartWeather';
import WeatherCard from './components/WeatherCard';
import Item from './components/Item';
import TomorrowWeatherCard from './components/TomorrowWeatherCard';
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
    windName: '',
  });

  const [tomorrowData, setTomorrowData] = useState({
    temperature: "",
    weatherName: "",
    imagen: "",
  });
  
  const Images: { [key: string]: string } = {
    GentleBreeze: "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/Gentle%20Breeze.webp",
    LightBreeze: "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/Light%20breeze.webp",
    Calm: "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/Calm.webp",
    lightrain: "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/light%20rain.webp",
    overcastclouds: "https://github.com/NLindao2004/dashboard/blob/main/src/Imagenes/overcast%20clouds.webp",
    brokenclouds: "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/broken%20clouds.webp",
    fewclouds: "https://github.com/NLindao2004/dashboard/blob/main/src/Imagenes/few%20clouds.webp",
    scatteredclouds: "https://github.com/NLindao2004/dashboard/blob/main/src/Imagenes/scattered%20clouds.webp",

  };

  
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
        const temperature = (parseFloat(xml.getElementsByTagName('temperature')[0]?.getAttribute('value') || '0') - 273.15).toFixed(1)+ '°C';
        const weatherDescription = xml.getElementsByTagName('symbol')[0]?.getAttribute('name') || '';
        const visibility = (parseFloat(xml.getElementsByTagName('visibility')[0]?.getAttribute('value') || '0') / 1000).toFixed(1) + ' km';
        const humidity = xml.getElementsByTagName('humidity')[0]?.getAttribute('value') + '%';
        const pressure = xml.getElementsByTagName('pressure')[0]?.getAttribute('value') + ' hPa';
        const windSpeed = xml.getElementsByTagName('windSpeed')[0]?.getAttribute('mps') + ' m/s';
        const windDirection = xml.getElementsByTagName('windDirection')[0]?.getAttribute('code') || '';
        const windGust = xml.getElementsByTagName('windGust')[0]?.getAttribute('gust') + ' m/s';
        const cloudCoverage = xml.getElementsByTagName('clouds')[0]?.getAttribute('all') + '%';
        const windName = xml.getElementsByTagName('windSpeed')[0]?.getAttribute('name') ?? '';


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
          windName,
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
          const dateStart = (time.getAttribute("from") || "").split("T")[1] || "";
          const dateEnd = (time.getAttribute("to") || "").split("T")[1] || "";

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


        
        let tomorrowTemperature = "";
        let tomorrowWeatherName = "";
        let imageProbability = "";
        
        // Obtiene la fecha actual y el día siguiente
        const currentDate = new Date();
        const tomorrowDate = new Date(currentDate);
        tomorrowDate.setDate(currentDate.getDate() + 1);
        
        // Convierte el día siguiente al formato de fecha YYYY-MM-DD
        const tomorrowString = tomorrowDate.toISOString().split("T")[0];
        
        // Recorre los elementos <time> para encontrar el bloque correspondiente
        for (let i = 0; i < times.length; i++) {
          const time = times[i];
          const fromDate = time.getAttribute("from") || "";
          const fromDateString = fromDate.split("T")[0]; // Obtiene la parte de la fecha (YYYY-MM-DD)
        
          // Si la fecha corresponde al día siguiente
          if (fromDateString === tomorrowString) {
            tomorrowTemperature = (
              parseFloat(
                time.getElementsByTagName("temperature")[0]?.getAttribute("value") || "0"
              ) - 273.15
            ).toFixed(1); // Convierte Kelvin a Celsius
            tomorrowWeatherName = time.getElementsByTagName("symbol")[0]?.getAttribute("name") || "";
        
            const probability = parseFloat(time.getElementsByTagName("precipitation")[0]?.getAttribute("value") || "0");
        
            // Asigna la imagen de acuerdo a la probabilidad de precipitación
            if (probability > 0.6) { // Probabilidad mayor al 60%
              imageProbability = "https://raw.githubusercontent.com/NLindao2004/dashboard/main/src/Imagenes/Lluvia.webp";
            } else {
              imageProbability = "https://raw.githubusercontent.com/NLindao2004/dashboard/main/src/Imagenes/sol.webp";
            }
        
            break; // Detiene el bucle al encontrar la coincidencia
          }
        }
        
        setTomorrowData({
          temperature: tomorrowTemperature,
          weatherName: tomorrowWeatherName,
          imagen: imageProbability,
        });
        
        
      }
    };

    fetchData();
  }, [owm]);

  return (
    <Grid container spacing={5}>
      {/* Tarjetas */}
      <Grid container spacing={6} size={12}>
        <Grid size={6}>
          <WeatherCard
            title="Clima"
            subtitle={weatherData.weatherDescription}
            mainValue={weatherData.temperature}
            description="Sobre el clima de hoy"
            details={[
              { label: 'Visibilidad', value: weatherData.visibility },
              { label: 'Humedad', value: weatherData.humidity },
              { label: 'Presión', value: weatherData.pressure },
            ]}
            imageUrl={Images[weatherData.weatherDescription.replace(/\s+/g, '')]}
          />
        </Grid>
        <Grid size={6}>
          <WeatherCardWind
            title="Viento"
            subtitle={weatherData.windName}
            mainValue={weatherData.windSpeed}
            description="Sobre el viento de hoy"
            details={[
              { label: 'Ráfaga', value: weatherData.windGust },
              { label: 'Dirección', value: weatherData.windDirection },
              { label: 'Nubes', value: weatherData.cloudCoverage },
            ]}
            imageUrl={Images[weatherData.windName.replace(/\s+/g, '')]}
          />
        </Grid>
      </Grid>

 
      <Grid container spacing={3}>
      {/* Contenedor de la gráfica y el selector */}
        <Grid
          size={{ xs: 12 }}
          sx={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Selector de Variables */}
          <ControlWeather
            selectedVariable={selectedVariable}
            onVariableChange={setSelectedVariable}
          />

          {/* Gráfica */}
          <LineChartWeather
            selectedVariable={selectedVariable}
            humidityData={humidityData}
            precipitationData={precipitationData}
            cloudsData={cloudsData}
            timeLabels={timeLabels}
          />
        </Grid>
      </Grid>

      <Grid container spacing={5}>
      <Grid size={12}>
        
        <TomorrowWeatherCard
          temperature={tomorrowData.temperature}
          weatherName={tomorrowData.weatherName}
          imageUrl={tomorrowData.imagen}
        />
      </Grid>
    </Grid>


      



      {/* Tabla */}
      <Grid container spacing={6} size={12} >
        <Grid size={12}>
          <TableWeather itemsIn={items} />
        </Grid>
      </Grid>
      
    </Grid>
  );
}

export default App;
