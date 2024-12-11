import React, { useState } from 'react';
import { TextField, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    onSearch(searchTerm); // Llamada a la función pasada por prop
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch(); // Ejecutar búsqueda al presionar Enter
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <TextField
        label="Buscar ciudad"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown} // Capturar Enter
        aria-label="Buscar ciudad"
      />
      <IconButton onClick={handleSearch} aria-label="Buscar" sx={{
            '&:focus': {
              outline: 'none', 
              color: 'black',
            },
          }}> 
        <SearchIcon sx={{ fontSize: 36 }} />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
