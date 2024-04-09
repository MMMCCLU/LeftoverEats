import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';

const ButtonProps = {
	border: '2px solid black',
	padding: '10px 20px', // Increase padding to make the button bigger
	fontSize: '1.2rem', // Increase font size
	backgroundColor: 'white',
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
		var hiddenItem = document.getElementById("hidden_div");
		hiddenItem.style.visibility = "visible";

		//zoom into current position
		//set circle 15m to say where can report
		//setCenter(testPos);
        // Close the drawer
        setOpen(false);
        setVisible(true);
      };

	const handleReportAction = (type) => {
		props.onReportActionClicked(type);
	};

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
		<div id="hidden_div" style={{visibility: 'hidden'}}>
			<Button onClick={() => handleReportAction("Cancel")} style={ButtonProps}> CANCEL </Button>
			<Button onClick={() => handleReportAction("Undo")} style={ButtonProps}> UNDO </Button>
			<Button onClick={() => handleReportAction("Confirm")} style={ButtonProps}> CONFIRM </Button>
		</div>
		<div style={{flex: "1", marginleft: "auto"}}>
			<Button onClick={toggleDrawer(true)} style={ButtonProps}> REPORT </Button>
		</div>
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
