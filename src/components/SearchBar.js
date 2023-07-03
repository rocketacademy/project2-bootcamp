import { Button, Container, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    console.log(`Searching Keyword: ${searchTerm}`);
    onSearch(searchTerm);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 20 }}>
      <TextField
        id="search"
        type="search"
        label="Search Tags"
        value={searchTerm}
        onChange={handleChange}
        sx={{ width: 600 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button onClick={handleSearch}>
                <SearchIcon />
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </Container>
  );
}
