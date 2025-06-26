import { Box, IconButton, useTheme, Button, Avatar, Tooltip } from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ColorModeContext, tokens } from './theme';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'; 
import LightModeIcon from '@mui/icons-material/LightMode';
import { motion } from 'framer-motion';
// Import the logo directly
import logoPath from '../public/EcoStep_Logo.png';

const TopBar = ({ logoPath: propLogoPath }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Use the logo from props if provided, otherwise use the imported one
  const finalLogoPath = propLogoPath || logoPath;

  return (
    <Box 
      component={motion.div}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      display="flex" 
      justifyContent="space-between" 
      alignItems="center" 
      p={2}
      sx={{
        borderBottom: `1px solid ${colors.grey[300]}`,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        backgroundColor: theme.palette.background.paper
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        {/* Logo with proper image tag */}
        <Avatar 
          component={motion.div}
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2 }
          }}
          src={finalLogoPath}
          alt="EcoStep Logo"
          sx={{ 
            width: 40, 
            height: 40,
            cursor: 'pointer',
            border: `2px solid ${colors.greenAccent[500]}`
          }}
          onClick={() => navigate('/')}
        />
        
        {/* Brand name with animation */}
        <Box 
          component={motion.div}
          whileHover={{ scale: 1.05 }}
          fontWeight={600} 
          fontSize={30} 
          onClick={() => navigate('/')}
          sx={{ 
            cursor: 'pointer',
            color: colors.greenAccent[500],
            userSelect: 'none'
          }}
        >
          Eco<b>Step</b>
        </Box>
        
        {/* Navigation Buttons with active state */}
        <Box display="flex" gap={4} ml={4}>
          <Button 
            component={motion.button}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            variant="text"
            onClick={() => navigate('/')}
            sx={{
              fontSize: 16,
              color: location.pathname === '/' 
                ? colors.greenAccent[500]
                : theme.palette.text.primary,
              textTransform: 'none',
              fontWeight: location.pathname === '/' ? 700 : 400,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: location.pathname === '/' ? '100%' : '0%',
                height: '3px',
                backgroundColor: colors.greenAccent[500],
                transition: 'width 0.3s ease'
              },
              '&:hover::after': {
                width: '100%'
              }
            }}
          >
            Dashboard
          </Button>
          <Button 
            component={motion.button}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            variant="text"
            onClick={() => navigate('/matrix')}
            sx={{
              fontSize: 16,
              color: location.pathname === '/matrix' 
                ? colors.greenAccent[500]
                : theme.palette.text.primary,
              textTransform: 'none',
              fontWeight: location.pathname === '/matrix' ? 700 : 400,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: location.pathname === '/matrix' ? '100%' : '0%',
                height: '3px',
                backgroundColor: colors.greenAccent[500],
                transition: 'width 0.3s ease'
              },
              '&:hover::after': {
                width: '100%'
              }
            }}
          >
            Analytics
          </Button>
        </Box>
      </Box>
      
      {/* Right side - Enhanced Dark Mode Toggle */}
      <Box>
        <Tooltip title={theme.palette.mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <IconButton 
            component={motion.button}
            whileHover={{ 
              rotate: 180, 
              scale: 1.2,
              backgroundColor: colors.grey[200] 
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.4 }}
            onClick={colorMode.toggleColorMode}
            sx={{ 
              borderRadius: '50%', 
              p: 1.5,
              border: `2px solid ${colors.greenAccent[500]}`,
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            {theme.palette.mode === 'light' ? 
              <DarkModeOutlinedIcon sx={{ color: colors.greenAccent[500] }} /> : 
              <LightModeIcon sx={{ color: colors.greenAccent[300] }} />
            }
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TopBar;