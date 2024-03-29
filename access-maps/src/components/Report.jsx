import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';

// TODO: This is a report button to add a feature to the map- Please IMPLEMENT ME!
function Report()
{
    const [open, setOpen] = useState(false);
    const [reportType, setReportType] = useState();
    const [reportMode, setReportMode] = useState(false);

    const toggleDrawer = (isOpen) => () => {
        setOpen(isOpen);
    };

    const handleReportSubmit = (type) => {
        setReportType(type);
        setReportMode(true);
        setOpen(false); // Close the drawer after report submission
    };

    const DrawerList = (
        <div>
            <Button onClick={() => handleReportSubmit('Ramp')}>Ramp</Button>
            <Button onClick={() => handleReportSubmit('Stair')}>Stair</Button>
            <Button onClick={() => handleReportSubmit('Elevator')}>Elevator</Button>
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
            {reportMode && <p>Report submitted: {reportType}</p>}
        </Drawer>
        
    </div>
    
    );
};
export default Report;