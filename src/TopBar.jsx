import { Box, IconButton, useTheme, Button } from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorModeContext, tokens } from './theme';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'; 
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

const TopBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
      <Box display="flex" alignItems="center" gap={6}>
        <image href='../EcoStep_Logo.png'></image>
        <Box fontWeight={600} fontSize={30}>Eco<b>Step</b></Box>
        
        {/* Navigation Buttons */}
        <Box display="flex" gap={6}>
          <Button 
            variant="text"
            onClick={() => navigate('/')}
            sx={{
              fontSize: 16,
              color: theme.palette.text.primary,
              textTransform: 'none',
              fontWeight: 400,
              '&:hover': {
                backgroundColor: colors.greenAccent[100],
                color: colors.greenAccent[600]
              }
            }}
          >
            Dashboard
          </Button>
          <Button 
            variant="text"
            onClick={() => navigate('/matrix')}
            sx={{
              fontSize: 16,
              color: theme.palette.text.primary,
              textTransform: 'none',
              fontWeight: 400,
              '&:hover': {
                backgroundColor: colors.greenAccent[100],
                color: colors.greenAccent[600]
              }
            }}
          >
            Analytics
          </Button>
        </Box>
      </Box>
      
      {/* Right side - Icon Buttons */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeIcon />}
        </IconButton>
        <IconButton><NotificationsOutlinedIcon /></IconButton>
        <IconButton><SettingsOutlinedIcon /></IconButton>
        <IconButton><PersonRoundedIcon /></IconButton>
      </Box>
    </Box>
  );
};

export default TopBar;