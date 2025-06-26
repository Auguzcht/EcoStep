import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export - Updated to match your green dashboard
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#e8f5e8",
          200: "#c8e6c9",
          300: "#81c784",
          400: "#2e7d32", // Dark green from dashboard
          500: "#1b5e20", // Main dark green
          600: "#388e3c",
          700: "#2e7d32",
          800: "#1b5e20",
          900: "#0d4c0f",
        },
        greenAccent: {
          100: "#e8f5e8",
          200: "#c8e6c9",
          300: "#a5d6a7",
          400: "#81c784",
          500: "#4caf50", // Main green from dashboard
          600: "#43a047",
          700: "#388e3c",
          800: "#2e7d32",
          900: "#1b5e20",
        },
        redAccent: {
          100: "#ffebee",
          200: "#ffcdd2",
          300: "#ef9a9a",
          400: "#e57373",
          500: "#f44336",
          600: "#e53935",
          700: "#d32f2f",
          800: "#c62828",
          900: "#b71c1c",
        },
        blueAccent: {
          100: "#e3f2fd",
          200: "#bbdefb",
          300: "#90caf9",
          400: "#64b5f6",
          500: "#2196f3",
          600: "#1e88e5",
          700: "#1976d2",
          800: "#1565c0",
          900: "#0d47a1",
        },
      }
    : {
        grey: {
          100: "#f8f9fa",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#ced4da",
          500: "#adb5bd",
          600: "#6c757d",
          700: "#495057",
          800: "#343a40",
          900: "#212529",
        },
        primary: {
          100: "#e8f5e8",
          200: "#c8e6c9",
          300: "#a5d6a7",
          400: "#ffffff", // White background
          500: "#4caf50", // Main green from dashboard
          600: "#43a047",
          700: "#388e3c",
          800: "#2e7d32",
          900: "#1b5e20",
        },
        greenAccent: {
          100: "#e8f5e8",
          200: "#c8e6c9",
          300: "#a5d6a7",
          400: "#81c784",
          500: "#4caf50", // Bright green from dashboard
          600: "#43a047",
          700: "#388e3c",
          800: "#2e7d32",
          900: "#1b5e20",
        },
        redAccent: {
          100: "#ffebee",
          200: "#ffcdd2",
          300: "#ef9a9a",
          400: "#e57373",
          500: "#f44336",
          600: "#e53935",
          700: "#d32f2f",
          800: "#c62828",
          900: "#b71c1c",
        },
        blueAccent: {
          100: "#e3f2fd",
          200: "#bbdefb",
          300: "#90caf9",
          400: "#64b5f6",
          500: "#2196f3",
          600: "#1e88e5",
          700: "#1976d2",
          800: "#1565c0",
          900: "#0d47a1",
        },
      }),
});

// mui theme settings - Updated for dashboard styling
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.greenAccent[500], // Main green
              light: colors.greenAccent[300],
              dark: colors.greenAccent[700],
            },
            secondary: {
              main: colors.greenAccent[400],
              light: colors.greenAccent[200],
              dark: colors.greenAccent[800],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500], // Dark green background
              paper: colors.primary[400],
            },
            text: {
              primary: colors.grey[100],
              secondary: colors.grey[200],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.greenAccent[500], // Main green from dashboard
              light: colors.greenAccent[300],
              dark: colors.greenAccent[700],
            },
            secondary: {
              main: colors.greenAccent[400],
              light: colors.greenAccent[200],
              dark: colors.greenAccent[800],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#ffffff", // Clean white background like dashboard
              paper: "#f8f9fa",
            },
            text: {
              primary: colors.primary[600],
              secondary: colors.grey[600],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
        fontSize: 40,
        fontWeight: 600,
      },
      h2: {
        fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
        fontSize: 32,
        fontWeight: 600,
      },
      h3: {
        fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 600,
      },
      h4: {
        fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 500,
      },
      h5: {
        fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 500,
      },
      h6: {
        fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
        fontSize: 14,
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
          contained: {
            boxShadow: 'none',
            backgroundColor: colors.greenAccent[500],
            '&:hover': {
              backgroundColor: colors.greenAccent[600],
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.24)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          },
        },
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};