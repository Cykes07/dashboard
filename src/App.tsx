
import './App.css'

import Grid from '@mui/material/Grid2' 
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';

import Item from './interface/items';

{/* Hooks */ }
import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {

  let [items, setItems] = useState<Item[]>([])

  {/* Variable de estado y función de actualización */}
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))

  {/* Hook: useEffect */}
  useEffect( ()=>{
    let request = async () => { 

      {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */}
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");

      {/* Obtenga la estampa de tiempo actual */}
      let nowTime = (new Date()).getTime();

       {/* Verifique si es que no existe la clave expiringTime o si la estampa de tiempo actual supera el tiempo de expiración */}
       if (expiringTime === null || nowTime > parseInt(expiringTime)) {
        try {
          {/* Request */}
          let API_KEY = "d3c1b9ec9a1cc3681d90ac7eb259e7b3";
          let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
      
          if (!response.ok) {
            throw new Error("Failed to fetch data from the API");
          }
      
          let responseText = await response.text();
      
          {/* Tiempo de expiración */}
          let hours = 0.01;
          let delay = hours * 3600000;
          let expiringTime = nowTime + delay;
      
          {/* En el LocalStorage, almacene el texto de la respuesta en la clave openWeatherMap */}
          localStorage.setItem("openWeatherMap", responseText);
          localStorage.setItem("expiringTime", expiringTime.toString());
          localStorage.setItem("nowTime", nowTime.toString());
      
          {/* DateTime */}
          localStorage.setItem("expiringDateTime", new Date(expiringTime).toString());
          localStorage.setItem("nowDateTime", new Date(nowTime).toString());
      
          {/* Modificación de la variable de estado mediante la función de actualización */}
          setOWM(responseText);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      
      {/* Valide el procesamiento con el valor de savedTextXML */}
      if( savedTextXML ) {

        {/* XML Parser */}
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        {/* Arreglo para agregar los resultados */}

        let dataToIndicators : Indicator[] = new Array<Indicator>();

        let dataToItems: Item[] = [];

        {/* 
            Análisis, extracción y almacenamiento del contenido del XML 
            en el arreglo de resultados
        */}

        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        dataToIndicators.push({"title":"Location", "subtitle": "City", "value": name})

        let location = xml.getElementsByTagName("location")[1]

        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

        let altitude = location.getAttribute("altitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })

        console.log( dataToIndicators )

        const formatTime = (dateString: string) => {
          const date = new Date(dateString);
          return date.toTimeString().split(' ')[0];
        };

        const timeNodes = xml.getElementsByTagName("time");
        for (let i = 0; i < Math.min(6, timeNodes.length); i++) {
          const timeNode = timeNodes[i];

          const from = timeNode.getAttribute("from") || "";
          const to = timeNode.getAttribute("to") || "";

          const precipitation = timeNode.querySelector("precipitation")?.getAttribute("probability") || "";
          const humidity = timeNode.querySelector("humidity")?.getAttribute("value") || "";
          const clouds = timeNode.querySelector("clouds")?.getAttribute("all") || "";

          dataToItems.push({ 
            dateStart: formatTime(from), 
            dateEnd: formatTime(to), 
            precipitation, 
            humidity, 
            clouds 
          });
        }

        {/* Modificación de la variable de estado mediante la función de actualización */}
        setIndicators( dataToIndicators )
        setItems(dataToItems);


      }
    }

    request();

  }, [owm] )
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
  {/* JSX */}
  return (
    <Grid container spacing={5}>

        {/* Indicadores
        <Grid size={{ xs: 12, md: 3 }}><IndicatorWeather title={'Indicator 1'} subtitle={'Unidad 1'} value={"1.23"} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><IndicatorWeather title={'Indicator 2'} subtitle={'Unidad 2'} value={"3.12"}/></Grid>
        <Grid size={{ xs: 12, md: 3 }}><IndicatorWeather title={'Indicator 3'} subtitle={'Unidad 3'} value={"2.31"}/></Grid>
        <Grid size={{ xs: 12, md: 3 }}><IndicatorWeather title={'Indicator 4'} subtitle={'Unidad 4'} value={"3.21"}/></Grid> */}
        
        {renderIndicators()}

        {/* Tabla */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Grid Anidado */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <ControlWeather/>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <TableWeather itemsIn={items}/>
            </Grid>
          </Grid>
        </Grid>

        {/* Gráfico */}
        <Grid size={{ xs: 12, md: 4 }}>
          <LineChartWeather/>
        </Grid>

        
       
    </Grid>
)
}

export default App

