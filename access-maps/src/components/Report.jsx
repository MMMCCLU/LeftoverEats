import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import cancelIcon from "../images/Cancel.svg"
import undoIcon from "../images/Undo.svg"
import confirmIcon from "../images/Checkmark.svg"
import test from "../images/ElevatorMarkerUnsure.svg"
import test2 from "../images/UndoTest.svg"

const buttonProps = {
	border: '2px solid black',
	padding: '10px 20px', // Increase padding to make the button bigger
	fontSize: '1.2rem', // Increase font size
	backgroundColor: 'white',
};

const cancelButton = {
	...buttonProps,
	width: "75px",
	height: "75px",
}

const undoButton = {
	...buttonProps,
	width: "75px",
	height: "75px",
}

const confirmButton = {
	...buttonProps,
	width: "75px",
	height: "75px",
}

const Report = (props) => {
    const [open, setOpen] = useState(false);
	const [visible, setVisible] = useState(false);

    const toggleReportDrawer = (isOpen) => () => {
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

	//vertial list of buttons
    const DrawerList = (
        <div style={{display: "space-between"}}>
            <Button style={{display: "block"}} onClick={() => handleReportClick("Ramp")}>Ramp</Button>
            <Button style={{display: "block"}} onClick={() => handleReportClick("Stair")}>Stair</Button>
            <Button style={{display: "block"}} onClick={() => handleReportClick("Elevator")}>Elevator</Button>
            {/* ADD MORE REPORT CASES */}
        </div>
    );

    return (
	<div>
		<div id="hidden_div" style={{visibility: 'hidden'}}>
			<Button onClick={() => handleReportAction("Cancel")} style={cancelButton}>
				<img src={cancelIcon} height="200%" width="200%"/>
			</Button>
			<Button onClick={() => handleReportAction("Undo")} style={undoButton}>
				<img src={undoIcon} height="150%" width="150%"/>
			</Button>
			<Button onClick={() => handleReportAction("Confirm")} style={confirmButton}>
				<img src={confirmIcon} height="140%" width="140%"/>
			</Button>
		</div>
		<div style={{flex: "1", marginleft: "auto"}}>
			<Button onClick={toggleReportDrawer(true)} style={buttonProps}> REPORT </Button>
		</div>
		<Drawer
			anchor="right"
			open={open}
			onClose={toggleReportDrawer(false)}
			BackdropProps={{invisible: true}}
			PaperProps={{ sx: { height: "13%" } }}
		>
		{DrawerList}
		</Drawer>
	</div>
    );
};
export default Report;
