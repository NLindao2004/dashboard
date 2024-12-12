import './App.css';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import WeatherCardWind from './components/WeatherCardWind';
import LineChartWeather from './components/LineChartWeather';
import RainCard from './components/RainCard';
import WeatherCard from './components/WeatherCard';
import Item from './components/Item';
import TomorrowWeatherCard from './components/TomorrowWeatherCard';
import HamburgerMenu from './components/HamburgerMenu';
import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';


function App() {
  const [owm, setOwm] = useState<string>('Guayaquil');

  const [items, setItems] = useState<Item[]>([]);
  const [humidityData, setHumidityData] = useState<number[]>([]);
  const [precipitationData, setPrecipitationData] = useState<number[]>([]);
  const [cloudsData, setCloudsData] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const [selectedVariable, setSelectedVariable] = useState<string>("humidity");
  const [loading, setLoading] = useState(true);
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

  const [rainCardState, setRainCardState] = useState({
    imagen: "",
  });


  const Images: { [key: string]: string } = {
    GentleBreeze: "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/Gentle%20Breeze.webp",
    LightBreeze: "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/Light%20breeze.webp",
    Calm: "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/Calm.webp",
    lightrain: "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/light%20rain.webp",
    overcastclouds: "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/overcast%20clouds.webp",
    brokenclouds: "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/broken%20clouds.webp",
    fewclouds: "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/few%20clouds.webp",
    scatteredclouds: "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/scattered%20clouds.webp",

  };

  const cities = [
    "Quito", "Cuenca", "Guaranda", "Azogues", "Tulcán", "Riobamba", "Latacunga", "Machala", "Esmeraldas", "Puerto Baquerizo Moreno", "Ibarra", "Loja", "Babahoyo",
    "Portoviejo", "Macas", "Tena", "Puyo", "Santa Elena", "Santo Domingo", "Nueva Loja", "Ambato", "Zamora"
  ];



  const getLocalStorageData = () => {
    const savedTextXML = localStorage.getItem("openWeatherMap") || "";
    const expiringTime = localStorage.getItem("expiringTime");
    const savedCity = localStorage.getItem("city") || "";
    return { savedTextXML, expiringTime, savedCity };
  };

  const saveToLocalStorage = (data: string, city: string) => {
    const nowTime = new Date().getTime();
    const hours = 0.01; // Ajusta el tiempo como desees
    const delay = hours * 3600000;
    const expiringTime = nowTime + delay;
    localStorage.setItem("city", city);
    localStorage.setItem("openWeatherMap", data);
    localStorage.setItem("expiringTime", expiringTime.toString());
  };


  const parseWeatherData = (xml: Document) => {

    const temperature = (parseFloat(xml.getElementsByTagName('temperature')[0]?.getAttribute('value') || '0') - 273.15).toFixed(1) + '°C';
    const weatherDescription = xml.getElementsByTagName('symbol')[0]?.getAttribute('name') || '';
    const visibility = (parseFloat(xml.getElementsByTagName('visibility')[0]?.getAttribute('value') || '0') / 1000).toFixed(1) + ' km';
    const humidity = xml.getElementsByTagName('humidity')[0]?.getAttribute('value') + '%';
    const pressure = xml.getElementsByTagName('pressure')[0]?.getAttribute('value') + ' hPa';
    const windSpeed = xml.getElementsByTagName('windSpeed')[0]?.getAttribute('mps') + ' m/s';
    const windDirection = xml.getElementsByTagName('windDirection')[0]?.getAttribute('code') || '';
    const windGust = xml.getElementsByTagName('windGust')[0]?.getAttribute('gust') + ' m/s';
    const cloudCoverage = xml.getElementsByTagName('clouds')[0]?.getAttribute('all') + '%';
    const windName = xml.getElementsByTagName('windSpeed')[0]?.getAttribute('name') || '';

    return {
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
    };
  };



  const parseRainCard = (xml: Document) => {

    const precipitationToday = parseFloat(
      xml.getElementsByTagName("precipitation")[0]?.getAttribute("probability") || "0"
    );

    let imageProbability = "";

    if (precipitationToday >= 0.7 && precipitationToday < 1) {
      imageProbability = "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/cloudRain.gif";
    } else if (precipitationToday < 0.7) {
      imageProbability = "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/cloudSunny.gif";
    } else if (precipitationToday == 1) {
      imageProbability = "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/heavyRain.gif";
    }

    return {
      imagen: imageProbability,
    };
  };

  const parseForecastData = (xml: Document, maxEntries = 6) => {
    const times = xml.getElementsByTagName("time");
    const humidityValues: number[] = [];
    const precipitationValues: number[] = [];
    const cloudsValues: number[] = [];
    const labels: string[] = [];

    for (let i = 0; i < Math.min(maxEntries, times.length); i++) {
      const time = times[i];
      const dateStart = (time.getAttribute("from") || "").split("T")[1] || "";
      const precipitation = time.getElementsByTagName("precipitation")[0]?.getAttribute("probability") || "0";
      const humidity = time.getElementsByTagName("humidity")[0]?.getAttribute("value") || "0";
      const clouds = time.getElementsByTagName("clouds")[0]?.getAttribute("all") || "0";

      humidityValues.push(parseFloat(humidity));
      precipitationValues.push(parseFloat(precipitation));
      cloudsValues.push(parseFloat(clouds));
      labels.push(dateStart);
    }

    return { humidityValues, precipitationValues, cloudsValues, labels };
  };


  const processTomorrowData = (times: HTMLCollectionOf<Element>) => {
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

        const probability = parseFloat(
          time.getElementsByTagName("precipitation")[0]?.getAttribute("probability") || "0"
        );

        // Asigna la imagen de acuerdo a la probabilidad de precipitación
        if (probability > 0.6) {
          imageProbability = "https://raw.githubusercontent.com/NLindao2004/dashboard/refs/heads/main/src/Imagenes/Lluvia.webp";
        } else {
          imageProbability = "https://raw.githubusercontent.com/NLindao2004/dashboard/main/src/Imagenes/sol.webp";
        }

        break; // Detiene el bucle al encontrar la coincidencia
      }
    }

    // Devuelve los datos procesados
    return {
      temperature: tomorrowTemperature,
      weatherName: tomorrowWeatherName,
      imagen: imageProbability,
    };
  };


  const fetchWeatherData = async (city: string = "Guayaquil") => {
    // Verifica la ciudad
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&mode=xml&appid=2f997379b9826ef9e1a4fb69507743af`
    );
    const data = await response.text();
    console.log(response);
    return data;
  };

  const handleSearch = (city: string) => {
    const isValidCity = cities.includes(city);
    if (!isValidCity) {
      alert(`La ciudad ${city} no es válida. Se utilizará Guayaquil por defecto.`);
    }
    const newCity = isValidCity ? city : "Guayaquil";
    setOwm(newCity); // Actualiza la ciudad
    console.log(owm);
  };

  useEffect(() => {

    const fetchData = async () => {
      const { savedTextXML, expiringTime, savedCity } = getLocalStorageData();
      const nowTime = new Date().getTime();
      let xmlData = savedTextXML;

      console.log('Ciudad nueva', { owm })
      if (!expiringTime || nowTime > parseInt(expiringTime) || savedCity !== owm) {
        xmlData = await fetchWeatherData(owm);
        saveToLocalStorage(xmlData, owm);
      }

      if (xmlData) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlData, "application/xml");
        const times = xml.getElementsByTagName("time");

        // Datos para las tarjetas
        const weatherInfo = parseWeatherData(xml);
        setWeatherData(weatherInfo);
        
        const imgRain = parseRainCard(xml);
        setRainCardState(imgRain);

        // Datos para la tabla y el gráfico
        const { humidityValues, precipitationValues, cloudsValues, labels } = parseForecastData(xml);
        setHumidityData(humidityValues);
        setPrecipitationData(precipitationValues);
        setCloudsData(cloudsValues);
        setTimeLabels(labels);

        // Procesar los datos para mañana
        const tomorrowInfo = processTomorrowData(times);
        setTomorrowData(tomorrowInfo);

        // Obtención de datos por ciudades
        const dataToItems: Item[] = [];
        for (const city of cities) {
          const cityData = await fetchWeatherData(city);
          const cityXml = parser.parseFromString(cityData, "application/xml");

          const temperature = (
            parseFloat(cityXml.getElementsByTagName("temperature")[0]?.getAttribute("value") || "0") - 273.15
          ).toFixed(1) + "°C";
          const humidity = cityXml.getElementsByTagName("humidity")[0]?.getAttribute("value") + "%";
          const clouds = cityXml.getElementsByTagName("clouds")[0]?.getAttribute("all") + "%";
          const precipitationProbability = parseFloat(
            cityXml.getElementsByTagName("precipitation")[0]?.getAttribute("probability") || "0"
          );

          let precipitation = "";
          if (precipitationProbability > 0.7 && precipitationProbability < 1) {
            precipitation = "🌧️";
          } else if (precipitationProbability < 0.7) {
            precipitation = "☁️";
          } else if (precipitationProbability == 1) {
            precipitation = "⛈️";
          }

          dataToItems.push({ city, temperature, humidity, precipitation, clouds });

        }
        setItems(dataToItems);
        setLoading(false);
      }
    };

    fetchData();
  }, [owm]);




  return (
    <Grid container spacing={5}>

      <Grid container spacing={6} size={12}>
        {/* Menú Hamburguesa */}
        <Grid size={{ xs: 12, xl: 1 }}>
          <HamburgerMenu />
        </Grid>

        {/* Título  */}
        <Grid size={{ xs: 6, xl: 7 }} container justifyContent="left" alignItems="center">
          <Typography
            variant="h1"
            align="center"
            sx={{ fontSize: '40px' }}
          >
            Clima en  {owm} - Hoy
          </Typography>
        </Grid>

        <Grid size={{ xs: 6, xl: 4 }} container justifyContent="flex-end" >
          <SearchBar onSearch={handleSearch} />
        </Grid>

      </Grid>

      {/* Tarjetas */}
      <Grid container spacing={6} size={12} id="card">
        <Grid size={{ xs: 12, xl: 6 }}>
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
            loading={loading} 
          />
        </Grid>
        <Grid size={{ xs: 12, xl: 6 }}>
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
            loading={loading}
          />
        </Grid>
      </Grid>


      <Grid container spacing={6} id="grafica" size={12}>
        {/* Contenedor de la gráfica y el selector */}
        <Grid
          size={{ xs: 12, xl: 9 }}
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

        <Grid container spacing={3} direction={'column'} size={{ xs: 12, xl: 3 }}>


          <Grid size={{ xs: 12 }}>

            <RainCard
              imageUrl={rainCardState.imagen}
            />

          </Grid>
          <Grid size={{ xs: 12 }}>

            <TomorrowWeatherCard
              temperature={tomorrowData.temperature}
              weatherName={tomorrowData.weatherName}
              imageUrl={tomorrowData.imagen}
            />
          </Grid>

        </Grid>
      </Grid>


      {/* Tabla */}
      <Grid container spacing={6} size={12} id="tabla">
        <Grid size={12}>
          <TableWeather itemsIn={items} loading={loading} />
        </Grid>
      </Grid>

    </Grid>
  );
}

export default App;
