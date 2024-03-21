import Report from "./Report";
import Search from "./Search";

function NavBar()
{
    return (
        <div style={{ display: 'flex', border: '2px solid black', padding: '10px' }}>
            <Search />
            <div style={{ marginLeft: 'auto' }}> {/* Aligns the Report button all the way to the right */}
                <Report />
            </div>
        </div>
    );
};
export default NavBar;