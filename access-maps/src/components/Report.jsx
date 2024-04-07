import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';

const actionButtonProps = {
	display: 'none',
	border: '2px solid black',
	padding: '10px 20px', // Increase padding to make the button bigger
	fontSize: '1.2rem', // Increase font size
};

const reportButtonProps = {
	border: '2px solid black',
	padding: '10px 20px', // Increase padding to make the button bigger
	fontSize: '1.2rem', // Increase font size
	justifyContent: 'right',
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
		//var hiddenItem = document.getElementById("hidden_div");
		//hiddenItem.style.display = "block";
		var buttons = document.getElementsByClassName("hidden_button");
		for (var i = 0; i < buttons.length; ++i) {
			var item = buttons[i];
			item.style.display = "block";
		}

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
	<div >
		<div style={{display:"flex", flexWrap:"nowrap", justifyContent:"center", alignItems:"center"}}>
			<Button class="hidden_button" onClick={() => handleReportAction("Cancel")} style={actionButtonProps}> CANCEL </Button>
			<Button class="hidden_button" onClick={() => handleReportAction("Undo")} style={actionButtonProps}> UNDO </Button>
			<Button class="hidden_button" onClick={() => handleReportAction("Confirm")} style={actionButtonProps}> CONFIRM </Button>
			<Button onClick={toggleDrawer(true)} style={reportButtonProps}> REPORT </Button>
			<div>
				<span id="report_label"></span>
			</div>
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
