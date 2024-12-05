import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface ControlWeatherProps {
  selectedVariable: string; // Variable actualmente seleccionada (humidity, precipitation, clouds)
  onVariableChange: (variable: string) => void; // Función para actualizar la variable seleccionada
}

export default function ControlWeather({
  selectedVariable,
  onVariableChange,
}: ControlWeatherProps) {
  // Lista de variables meteorológicas
  const items = [
    {
      value: 'precipitation',
      name: 'Precipitación',
    },
    {
      value: 'humidity',
      name: 'Humedad',
    },
    {
      value: 'clouds',
      name: 'Nubosidad',
    },
  ];

  // Manejador de cambios en el `Select`
  const handleChange = (event: SelectChangeEvent) => {
    const variable = event.target.value;
    onVariableChange(variable); // Notificar a App.tsx sobre la selección
  };

  // Opciones del Select
  const options = items.map((item) => (
    <MenuItem key={item.value} value={item.value}>
      {item.name}
    </MenuItem>
  ));

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography mb={2} component="h3" variant="h6" color="primary">
        Variables Meteorológicas
      </Typography>

      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="simple-select-label">Variables</InputLabel>
          <Select
            labelId="simple-select-label"
            id="simple-select"
            value={selectedVariable}
            onChange={handleChange}
            label="Variables"
          >
            {options}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
}
