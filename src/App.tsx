import './App.css';
import Grid from '@mui/material/Grid';
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import { useEffect, useState } from 'react';

interface Indicator {
  title?: string;
  subtitle?: string;
  value?: string;
}

interface Item {
  dateStart: string;
  dateEnd: string;
  precipitation: string;
  humidity: string;
  clouds: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [owm, setOWM] = useState(localStorage.getItem('openWeatherMap'));
  const [selectedVariable, setSelectedVariable] = useState('Precipitación');

  useEffect(() => {
    const request = async () => {
      let savedTextXML = localStorage.getItem('openWeatherMap') || '';
      let expiringTime = localStorage.getItem('expiringTime');
      let nowTime = new Date().getTime();

      if (expiringTime === null || nowTime > parseInt(expiringTime)) {
        const API_KEY = 'd3c1b9ec9a1cc3681d90ac7eb259e7b3';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`
        );
        savedTextXML = await response.text();
        const hours = 0.01;
        const delay = hours * 3600000;
        const newExpiringTime = nowTime + delay;

        localStorage.setItem('openWeatherMap', savedTextXML);
        localStorage.setItem('expiringTime', newExpiringTime.toString());
      }

      if (savedTextXML) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, 'application/xml');
        const dataToIndicators: Indicator[] = [];
        const dataToItems: Item[] = [];

        const name = xml.getElementsByTagName('name')[0]?.innerHTML || '';
        dataToIndicators.push({ title: 'Location', subtitle: 'City', value: name });

        const location = xml.getElementsByTagName('location')[1];
        const latitude = location?.getAttribute('latitude') || '';
        const longitude = location?.getAttribute('longitude') || '';
        const altitude = location?.getAttribute('altitude') || '';

        dataToIndicators.push({ title: 'Location', subtitle: 'Latitude', value: latitude });
        dataToIndicators.push({ title: 'Location', subtitle: 'Longitude', value: longitude });
        dataToIndicators.push({ title: 'Location', subtitle: 'Altitude', value: altitude });

        const timeNodes = xml.getElementsByTagName('time');
        for (let i = 0; i < Math.min(6, timeNodes.length); i++) {
          const timeNode = timeNodes[i];
          const from = timeNode.getAttribute('from') || '';
          const to = timeNode.getAttribute('to') || '';
          const precipitation = timeNode.querySelector('precipitation')?.getAttribute('value') || '0';
          const humidity = timeNode.querySelector('humidity')?.getAttribute('value') || '0';
          const clouds = timeNode.querySelector('clouds')?.getAttribute('value') || '0';

          dataToItems.push({ dateStart: from, dateEnd: to, precipitation, humidity, clouds });
        }

        setIndicators(dataToIndicators);
        setItems(dataToItems);
      }
    };

    request();
  }, [owm]);

  const handleVariableChange = (variable: string) => {
    setSelectedVariable(variable);
  };

  const getDataForGraph = () => {
    return items.map((item) => {
      switch (selectedVariable) {
        case 'Precipitación':
          return { name: item.dateStart, value: parseFloat(item.precipitation) };
        case 'Humedad':
          return { name: item.dateStart, value: parseFloat(item.humidity) };
        case 'Nubosidad':
          return { name: item.dateStart, value: parseFloat(item.clouds) };
        default:
          return { name: item.dateStart, value: 0 };
      }
    });
  };

  return (
    <Grid container spacing={2} style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      {/* Indicadores superiores */}
      {indicators.map((indicator, idx) => (
        <Grid key={idx} item xs={12} md={3}>
          <IndicatorWeather
            title={indicator.title}
            subtitle={indicator.subtitle}
            value={indicator.value}
          />
        </Grid>
      ))}

      {/* Contenido principal */}
      <Grid container spacing={2}>
        {/* Variables (Controles) a la izquierda */}
        <Grid item xs={12} md={4}>
          <ControlWeather onVariableChange={handleVariableChange} />
        </Grid>

        {/* Gráfico a la derecha */}
        <Grid item xs={12} md={8}>
          <LineChartWeather
            data={getDataForGraph().map((item) => item.value)}
            labels={getDataForGraph().map((item) => item.name)}
            variableLabel={selectedVariable}
          />
        </Grid>
      </Grid>

      {/* Tabla debajo */}
      <Grid item xs={12}>
        <TableWeather itemsIn={items} />
      </Grid>
    </Grid>
  );
}

export default App;