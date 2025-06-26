import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ColorModeContext, useMode } from './theme.js';
import TopBar from './TopBar.jsx';  
import Dashboard from './Dashboard.jsx';
import Matrix from './Matrix.jsx';
// Import the thingspeakService to initialize it
import './services/thingspeakService.js';
// Import logo directly to make sure it's included in the build
import logoPath from '../public/EcoStep_Logo.png';

const App = () => {
  const [theme, colorMode] = useMode();
  
  // Set favicon dynamically to ensure it works in both dev and production
  useEffect(() => {
    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = logoPath;
    }
    
    // Update Open Graph image
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.content = logoPath;
    }
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router basename={import.meta.env.MODE === 'production' ? '/' : '/EcoStep'}>
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <TopBar logoPath={logoPath} />
            <Box component="main" flexGrow={1} p={2}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/matrix" element={<Matrix />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

// Render the appx
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

export default App;