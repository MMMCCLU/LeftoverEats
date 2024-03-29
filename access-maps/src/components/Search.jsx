import { TextField, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import availableOptions from '../util/cities.json';

function Search()
{
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        // Push the search query to the URL
        navigate(`/map/${searchQuery}`);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Autocomplete
                freeSolo
                options={availableOptions}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        id="outlined-basic"
                        label="Search..."
                        variant="outlined"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        onKeyPress={handleKeyPress} // Add key press event handler
                    />
                )}
                inputValue={searchQuery}
                onInputChange={(event, newInputValue) => setSearchQuery(newInputValue)}
                style={{ minWidth: 200 }} // Set a minimum width for the Autocomplete
                limitTags={5} 
            />
            <Button onClick={(handleSearch)} style={{ marginLeft: 8 }}>
                <SearchIcon/>
            </Button>
        </div>
    );
};
export default Search;