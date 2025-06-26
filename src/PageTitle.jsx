import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "./theme";

const PageTitle = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Box marginBottom={4}>
      <Typography
        component="h1"
        variant="h2"
        sx={{ 
          color: colors.primary[700],
          fontWeight: 700,
          marginBottom: "15px",
          letterSpacing: "-0.02em",
          fontSize: "40px"
        }}
      >
        {title}
      </Typography>
      <Typography 
        component="h2"
        variant="h5" 
        sx={{
          color: colors.grey[500],
          fontWeight: 500
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default PageTitle;