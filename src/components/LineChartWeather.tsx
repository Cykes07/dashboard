import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';

interface LineChartWeatherProps {
  data: number[]; // Valores para las series
  labels: string[]; // Etiquetas para el eje X
  variableLabel: string; // Etiqueta de la variable seleccionada
}

export default function LineChartWeather({ data, labels, variableLabel }: LineChartWeatherProps) {
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
          { data, label: variableLabel },
        ]}
        xAxis={[{ scaleType: 'point', data: labels }]}
      />
    </Paper>
  );
}