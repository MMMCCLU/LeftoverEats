import { TextField, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import availableOptions from '../util/cities.json';

function Search() {
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [showResults, setShowResults] = useState(false); // State to manage visibility of results
    const navigate = useNavigate();

    const handleSearch = () => {
        // Push the search query to the URL
        navigate(`/map/${startLocation}/${endLocation}`);
        setShowResults(true); // Show results after clicking the search button
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <p>Start Location:&nbsp;&nbsp;</p>
                <Autocomplete
                    freeSolo
                    options={availableOptions}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="outlined-basic-start"
                            label="Search..."
                            variant="outlined"
                            value={startLocation}
                            onChange={(event) => setStartLocation(event.target.value)}
                            onKeyPress={handleKeyPress} // Add key press event handler
                        />
                    )}
                    inputValue={startLocation}
                    onInputChange={(event, newInputValue) => setStartLocation(newInputValue)}
                    style={{ minWidth: 200 }} // Set a minimum width for the Autocomplete
                    limitTags={5}
                />
                <p>&nbsp;&nbsp;End Location:&nbsp;&nbsp;</p>
                <Autocomplete
                    freeSolo
                    options={availableOptions}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="outlined-basic-end"
                            label="Search..."
                            variant="outlined"
                            value={endLocation}
                            onChange={(event) => setEndLocation(event.target.value)}
                            onKeyPress={handleKeyPress} // Add key press event handler
                        />
                    )}
                    inputValue={endLocation}
                    onInputChange={(event, newInputValue) => setEndLocation(newInputValue)}
                    style={{ minWidth: 200 }} // Set a minimum width for the Autocomplete
                    limitTags={5}
                />
                <Button onClick={handleSearch} style={{ marginLeft: 8 }}>
                    <SearchIcon />
                </Button>
            </div>
            
            {showResults && ( // Conditionally render results based on showResults state
                <div>
                    <h2 id="report_label" style={{ alignItems: 'right' }}>Results</h2>
                    {/* Render your results here */}
                </div>
            )}
        </div>
    );
}

export default Search;
