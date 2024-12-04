import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useRef } from 'react';

interface ControlWeatherProps {
  selectedVariable: string; // Variable actualmente seleccionada (humidity, precipitation, clouds)
  onVariableChange: (variable: string) => void; // Función para actualizar la variable seleccionada
}

export default function ControlWeather({
  selectedVariable,
  onVariableChange,
}: ControlWeatherProps) {
  // Referencia para mostrar la descripción de la variable seleccionada
  const descriptionRef = useRef<HTMLDivElement>(null);

  // Lista de variables meteorológicas
  const items = [
    {
      value: 'precipitation',
      name: 'Precipitación',
      description: 'Cantidad de agua que cae sobre una superficie en un período específico.',
    },
    {
      value: 'humidity',
      name: 'Humedad',
      description: 'Cantidad de vapor de agua presente en el aire, generalmente expresada como un porcentaje.',
    },
    {
      value: 'clouds',
      name: 'Nubosidad',
      description: 'Grado de cobertura del cielo por nubes, afectando la visibilidad y la cantidad de luz solar recibida.',
    },
  ];

  // Manejador de cambios en el `Select`
  const handleChange = (event: SelectChangeEvent) => {
    const variable = event.target.value;
    onVariableChange(variable); // Notificar a App.tsx sobre la selección

    // Actualizar la descripción en el DOM
    const selectedItem = items.find((item) => item.value === variable);
    if (descriptionRef.current) {
      descriptionRef.current.innerHTML = selectedItem ? selectedItem.description : '';
    }
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

      {/* Descripción dinámica */}
      <Typography ref={descriptionRef} mt={2} component="p" color="text.secondary" />
    </Paper>
  );
}
