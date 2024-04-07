import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';

const actionButtonProps = {
	border: '2px solid black',
	padding: '10px 20px', // Increase padding to make the button bigger
	fontSize: '1.2rem', // Increase font size
};

const reportButtonProp = {
	border: '2px solid black',
	padding: '10px 20px', // Increase padding to make the button bigger
	fontSize: '1.2rem', // Increase font size
	justifyContent: 'right'
};
const Report = (props) => {
    const [open, setOpen] = useState(false);
	const [visible, setVisible] = useState(false);

    const toggleDrawer = (isOpen) => () => {
        setOpen(isOpen);
    };

    const handleReportClick = (type) => {
        // Call the onReportTypeChange function passed from Map component
        props.onReportTypeChange(type);
        // Close the drawer
        setOpen(false);
        setVisible(true);
      };

	const handleReportAction = (type) => {
		props.onReportActionClicked(type);
	};

    
	const ReportCue = (
		<div>
            <Button onClick={() => handleReportClick("Cancel")}>Cancel</Button>
            <Button onClick={() => handleReportClick("Undo")}>Undo</Button>
            <Button onClick={() => handleReportClick("Confirm")}>Confirm</Button>

		</div>
	);

    const DrawerList = (
        <div>
            <Button onClick={() => handleReportClick("Ramp")}>Ramp</Button>
            <Button onClick={() => handleReportClick("Stair")}>Stair</Button>
            <Button onClick={() => handleReportClick("Elevator")}>Elevator</Button>

            {/* ADD MORE REPORT CASES */}
        </div>
    );

    return (
	<div>
		<div id="hidden_div" style={{display:"none", justifyContent:"center", flexGrow:"1"}}>
			<Button style={actionButtonProps}> CANCEL </Button>
			<Button style={actionButtonProps}> UNDO </Button>
			<Button style={actionButtonProps}> CONFIRM </Button>
			<div>
				<h2>Reporting "thing": </h2>
			</div>
		   <Drawer
			  anchor="right"
			  open={open}
			  onClose={toggleDrawer(false)}
		   >

			  {DrawerList}
		   </Drawer>
		</div>
		<Button onClick={toggleDrawer(true)} style={actionButtonProps}> REPORT </Button>
	</div>
    );
};
export default Report;
