import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import { useEffect, useState } from 'react';
import Item from '../components/Item';

interface MyProp {
  itemsIn: Item[];
  loading: boolean; // Nuevo prop para indicar si los datos están cargándose
}

export default function BasicTable(props: MyProp) {
  const [rows, setRows] = useState<Item[]>([]);

  useEffect(() => {
    if (!props.loading) {
      setRows(props.itemsIn); // Actualiza las filas solo cuando los datos están listos
    }
  }, [props.itemsIn, props.loading]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead sx={{ backgroundColor: 'lightblue' }}>
          <TableRow>
            <TableCell>Ciudad</TableCell>
            <TableCell align="left">Temperatura</TableCell>
            <TableCell align="left">Precipitación</TableCell>
            <TableCell align="left">Humedad</TableCell>
            <TableCell align="left">Nubosidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.loading
            ? Array.from({ length: 22 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell align="left"><Skeleton variant="text" /></TableCell>
                  <TableCell align="left"><Skeleton variant="text" /></TableCell>
                  <TableCell align="left"><Skeleton variant="text" /></TableCell>
                  <TableCell align="left"><Skeleton variant="text" /></TableCell>
                </TableRow>
              ))
            : rows.map((row, idx) => (
                <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">{row.city}</TableCell>
                  <TableCell align="left">{row.temperature}</TableCell>
                  <TableCell align="left" sx={{ fontSize: '32px' }}>{row.precipitation}</TableCell>
                  <TableCell align="left">{row.humidity}</TableCell>
                  <TableCell align="left">{row.clouds}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
