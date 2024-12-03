import './App.css'
import Grid from '@mui/material/Grid2' 
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import Item from './components/Item';



{/* Hooks */ }
import { useEffect, useState } from 'react';

 interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  {/* Variable de estado y función de actualización */}
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))

  let [items, setItems] = useState<Item[]>([]);

  const [humidityData, setHumidityData] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);

    const [selectedVariable, setSelectedVariable] = useState('humidity');

{/* Hook: useEffect */}
useEffect(() => {
  let request = async () => {
    let savedTextXML = localStorage.getItem("openWeatherMap") || "";
    let expiringTime = localStorage.getItem("expiringTime");

    let nowTime = new Date().getTime();

    if (expiringTime === null || nowTime > parseInt(expiringTime)) {
      let response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=2f997379b9826ef9e1a4fb69507743af`
      );
      savedTextXML = await response.text();

      let hours = 0.01;
      let delay = hours * 3600000;
      let expiringTime = nowTime + delay;

      localStorage.setItem("openWeatherMap", savedTextXML);
      localStorage.setItem("expiringTime", expiringTime.toString());
      localStorage.setItem("nowTime", nowTime.toString());
      localStorage.setItem("expiringDateTime", new Date(expiringTime).toString());
      localStorage.setItem("nowDateTime", new Date(nowTime).toString());

      setOWM(savedTextXML);
    }

    if (savedTextXML) {
      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, "application/xml");

      let dataToIndicators: Indicator[] = [];
      let dataToItems: Item[] = [];
      let humidityValues: number[] = [];
      let labels: string[] = [];

      const times = xml.getElementsByTagName("time");
      for (let i = 0; i < Math.min(6, times.length); i++) {
        const time = times[i];
        const dateStart = time.getAttribute("from") || "";
        const dateEnd = time.getAttribute("to") || "";
        const precipitation = time
          .getElementsByTagName("precipitation")[0]
          ?.getAttribute("probability") || "";
        const humidity = time
          .getElementsByTagName("humidity")[0]
          ?.getAttribute("value") || "";
        const clouds = time.getElementsByTagName("clouds")[0]?.getAttribute("all") || "";

        // Agregar datos al arreglo para la tabla
        dataToItems.push({ dateStart, dateEnd, precipitation, humidity, clouds });

        // Agregar datos para el gráfico
        if (humidity) {
          humidityValues.push(parseFloat(humidity));
        }
        labels.push(dateStart); // Usar `dateStart` como etiqueta
      }

      // Extraer otros indicadores del XML
      let name = xml.getElementsByTagName("name")[0]?.innerHTML || "";
      dataToIndicators.push({ title: "Location", subtitle: "City", value: name });

      let location = xml.getElementsByTagName("location")[1];
      let latitude = location.getAttribute("latitude") || "";
      dataToIndicators.push({ title: "Location", subtitle: "Latitude", value: latitude });

      let longitude = location.getAttribute("longitude") || "";
      dataToIndicators.push({ title: "Location", subtitle: "Longitude", value: longitude });

      let altitude = location.getAttribute("altitude") || "";
      dataToIndicators.push({ title: "Location", subtitle: "Altitude", value: altitude });

      // Actualizar estados
      setIndicators(dataToIndicators);
      setItems(dataToItems);
      setHumidityData(humidityValues);
      setTimeLabels(labels);
    }
  };

  request();
}, [owm]);



  

  let renderIndicators = () => {

    return indicators
            .map(
                (indicator, idx) => (
                    <Grid key={idx} size={{ xs: 12, xl: 3 }}>
                        <IndicatorWeather 
                            title={indicator["title"]} 
                            subtitle={indicator["subtitle"]} 
                            value={indicator["value"]} />
                    </Grid>
                )
            )
     
}

  return (
    <Grid container spacing={5}>

    {renderIndicators()}

    {/* Tabla */}
    <Grid size={{ xs: 12, xl: 8 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, xl: 3 }}>
          <TableWeather itemsIn={items} />
        </Grid>
        <Grid size={{ xs: 12, xl: 9 }}>
          <TableWeather itemsIn={items} />
        </Grid>
      </Grid>
    </Grid>

    {/* Gráfico */}
    <Grid size={{ xs: 12, xl: 4 }}>
      <LineChartWeather humidityData={humidityData} timeLabels={timeLabels} />
    </Grid>
   
</Grid>
  )
}

export default App
