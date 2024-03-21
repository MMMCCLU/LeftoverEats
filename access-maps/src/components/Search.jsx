import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

// TODO: This is a search bar to pick a map- Please IMPLEMENT ME!
function Search()
{
    return (
        <div>
            <TextField id="outlined-basic" label="Search..." variant="outlined" />
            <Button>
                <SearchIcon/>
            </Button>
        </div>
    );
};
export default Search;