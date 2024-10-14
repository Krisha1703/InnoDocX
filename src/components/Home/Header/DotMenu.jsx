import { useState, useContext } from "react";
import { Email, Cloud, CalendarToday, Map, YouTube, Description, Photo, VideoCall, Contacts } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import ThemeContext from '../../Developer Mode/ThemeContext'; 

const DotMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  const { isDarkMode } = useContext(ThemeContext);

  const services = [
    { name: 'Gmail', icon: <Email /> },
    { name: 'Drive', icon: <Cloud /> },
    { name: 'Calendar', icon: <CalendarToday /> },
    { name: 'Maps', icon: <Map /> },
    { name: 'YouTube', icon: <YouTube /> },
    { name: 'Docs', icon: <Description /> },
    { name: 'Photos', icon: <Photo /> },
    { name: 'Meet', icon: <VideoCall /> },
    { name: 'Contacts', icon: <Contacts /> },
  ];

  return (
    <>
      <IconButton
        edge="end"
        color="inherit"
        onClick={handleClick}
      >
        <Image src="/dotmenu.png" width={30} height={30} alt="menu" />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: isDarkMode ? '#424242' : '#ffffff', //background color based on dark mode
            color: isDarkMode ? '#ffffff' : '#000000', // text color based on dark mode
          },
        }}
      >
        <div style={{ padding: 8, width: 200 }}>
          {services.map((service, index) => (
            <MenuItem key={index} onClick={handleClose} style={{ color: isDarkMode ? '#ffffff' : '#000000' }}> 
              {service.icon}
            </MenuItem>
          ))}
        </div>
      </Menu>
    </>
  );
};

export default DotMenu;
