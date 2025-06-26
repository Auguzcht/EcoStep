import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ColorModeContext, useMode } from './theme.js';
import TopBar from './TopBar.jsx';  
import Dashboard from './Dashboard.jsx';
import Matrix from './Matrix.jsx';


const App = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router basename="/EcoStep">
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <TopBar />
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