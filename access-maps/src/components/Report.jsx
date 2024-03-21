import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';

// TODO: This is a report button to add a feature to the map- Please IMPLEMENT ME!
function Report()
{
    const [open, setOpen] = useState(false);

    const toggleDrawer = (isOpen) => () => {
        setOpen(isOpen);
    };

    const DrawerList = (
        <div>
            <Button>Ramp</Button>
            <Button>Stair</Button>
            <Button>Elevator</Button>
            {/* ADD MORE REPORT CASES */}
        </div>
    );

    return (
    <div>
        <Button 
            onClick={toggleDrawer(true)}
            style={{
                border: '2px solid black',
                padding: '10px 20px', // Increase padding to make the button bigger
                fontSize: '1.2rem', // Increase font size
            }}
            >
                REPORT
        </Button>
        <Drawer 
            anchor="right"
            open={open} 
            onClose={toggleDrawer(false)}
        >

            {DrawerList}
        </Drawer>
    </div>
    );
};
export default Report;