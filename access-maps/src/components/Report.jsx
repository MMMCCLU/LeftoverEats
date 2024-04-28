import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import cancelIcon from "../images/Cancel.svg"
import undoIcon from "../images/Undo.svg"
import confirmIcon from "../images/Checkmark.svg"

const buttonProps = {
	border: '2px solid black',
	padding: '10px 20px', // Increase padding to make the button bigger
	fontSize: '1.2rem', // Increase font size
	backgroundColor: 'white',
};

const reportActionButton = {
	...buttonProps,
	width: "75px",
	height: "75px",
	marginLeft: "10px",
	marginRight: "10px",
}


const Report = (props) => {
    const [open, setOpen] = useState(false);
	const [openL, setOpenL] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleReportClick = () => {
        setOpen(true); // Open the report drawer
        handleMenuClose(); // Close the menu
    };

    const handleDrawerClose = () => {
        setOpen(false); // Close the report drawer
    };

	const handleLegendClick = () => {
        setOpenL(true); // Open the legend drawer
        handleMenuClose(); // Close the menu
    };

    const handleLegendClose = () => {
        setOpenL(false); // Close the legend drawer
    };

	const handleReport = (type) => {
        // Call the onReportTypeChange function passed from Map component
        props.onReportTypeChange(type);
		var hiddenItem = document.getElementById("hidden_div");
		hiddenItem.style.visibility = "visible";

		//zoom into current position
		//set circle 15m to say where can report
		//setCenter(testPos);
        // Close the drawer
        setOpen(false);
        //setVisible(true);
      };

	const handleReportAction = (type) => {
		props.onReportActionClicked(type);
	};  

	//vertial list of buttons
    const DrawerList = (
        <div style={{display: "space-between"}}>
			<Button style={{display: "block"}} onClick={() => handleReport("Elevator")}>Elevator</Button>
            <Button style={{display: "block"}} onClick={() => handleReport("Stair")}>Stair</Button>
			<Button style={{display: "block"}} onClick={() => handleReport("Ramp")}>Ramp</Button>
            {/* ADD MORE REPORT CASES */}
        </div>
    );

	const legendItems = [
		{ icon: "https://upload.wikimedia.org/wikipedia/commons/7/73/Aiga_elevator.png", label: "Elevator"},
		{ color: "#FFFF00", label: "Stairs"},
		{ color: "#03F5D4", label: "Ramp"},
	  ];

	const LegendList = legendItems.map((item, index) => (
		<div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 5}}>
		  {item.icon && <img src={item.icon} alt={item.label} style={{ width: 20, height: 20, backgroundColor: item.color, marginRight: 5}} />}
		  {item.color && <div style={{width: 20, height: 20, backgroundColor: item.color, marginRight: 5}}></div>}
		  <span>{item.label}</span>
		</div>
	 ))


	const items = [
        {
            label: 'Options',
            items: [
                { label: 'Refresh' },
                { label: 'Export' }
            ]
        }
    ];



    return (
        <div>
            <Button onClick={handleMenuOpen}
			style={{
				border: '2px solid black',
				padding: '10px 20px', // Increase padding to make the button bigger
				fontSize: '1.2rem', // Increase font size
				backgroundColor: 'white',
			}}
			>Menu</Button>
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleReportClick}>Report</MenuItem>
                <MenuItem onClick={handleLegendClick}>Legend</MenuItem>
                {/* Add more menu options as needed */}
            </Menu>

			<div id="hidden_div" style={{visibility: 'hidden'}}>
				<Button onClick={() => handleReportAction("Cancel")} style={reportActionButton}>
					<img src={cancelIcon} height="200%" width="200%"/>
				</Button>
				<Button onClick={() => handleReportAction("Undo")} style={reportActionButton}>
					<img src={undoIcon} height="150%" width="150%"/>
				</Button>
				<Button onClick={() => handleReportAction("Confirm")} style={reportActionButton}>
					<img src={confirmIcon} height="140%" width="140%"/>
				</Button>
		    </div>

            <Drawer
                anchor="right"
                open={open}
                onClose={handleDrawerClose}
                BackdropProps={{ invisible: true }}
                PaperProps={{ sx: { height: "23%" } }}
            >
				<div>
                    Report Missing Items
                </div>
                {DrawerList}
				<Button style={{display: "block"}} onClick={() => setOpen(false)}>Close</Button>
                
            </Drawer>

			<Drawer
                anchor="right"
                open={openL}
                onClose={handleLegendClose}
                BackdropProps={{ invisible: true }}
                PaperProps={{ sx: { height: "23%" } }}
            >
				<div>
                    Legend
                </div>
                {LegendList}
				<Button style={{display: "block"}} onClick={() => setOpenL(false)}>Close</Button>
                
            </Drawer>
        </div>
    );
};

export default Report;
