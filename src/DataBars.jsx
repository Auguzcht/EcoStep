import { Box, Typography, useTheme } from "@mui/material"
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import { tokens } from "./theme";

const DataBars = ({ title, value, icon, unit = "" }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const iconMap = {
        'battery': <BatteryFullIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, color: colors.grey[100] }} />,
        'power': <FlashOnIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, color: colors.grey[100] }} />,
        'lightbulb': <LightbulbOutlinedIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, color: colors.grey[100] }} />,
        'energy': <BatteryChargingFullIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, color: colors.grey[100] }} />
    };

    const getIcon = () => {
        if (typeof icon === 'string') {
            return iconMap[icon] || iconMap['battery'];
        }
        return icon;
    };

    return (
        <Box 
            width="100%" // Changed from fixed 520px to 100%
            height="auto" // Changed from fixed height to auto
            minHeight="130px" // Added minHeight instead
            m={0}
            p={{ xs: "15px", sm: "20px" }} // Responsive padding
            sx={{
                border: `2px solid ${colors.grey[400]}`,
                borderRadius: '8px',
                backgroundColor: colors.primary[400],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
            }}
        >
            <Box>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: colors.grey[600],
                        fontSize: { xs: '0.9rem', sm: '1.1rem' }, // Responsive font size
                        fontWeight: 600,
                        mb: 1
                    }}
                >
                    {title}
                </Typography>
                <Typography 
                    variant="h3" 
                    sx={{ 
                        color: colors.grey[800],
                        fontWeight: 'bold',
                        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' } // Responsive font size
                    }}
                >
                    {value}{unit}
                </Typography>
            </Box>
            
            <Box
                sx={{
                    backgroundColor: colors.greenAccent[500],
                    borderRadius: '8px',
                    p: { xs: '8px', sm: '12px' }, // Responsive padding
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: { xs: '50px', sm: '70px' }, // Responsive width
                    minHeight: { xs: '50px', sm: '70px' } // Responsive height
                }}
            >
                {getIcon()}
            </Box>
        </Box>
    )
}

export const DataBarsExample = () => {
    const sampleData = [
        {
            title: "Voltage Stored",
            value: "2.4",
            unit: "V",
            icon: "battery"
        },
        {
            title: "Power Output",
            value: "3.5",
            unit: "W",
            icon: "power"
        },
        {
            title: "Activation Total Count",
            value: "845",
            unit: "",
            icon: "lightbulb"
        },
        {
            title: "Energy Storage Level",
            value: "78",
            unit: "%",
            icon: "energy"
        }
    ];

    return (
        <Box 
            display="flex" 
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={2}
            p={2}
        >
            {sampleData.map((item, index) => (
                <DataBars
                    key={index}
                    title={item.title}
                    value={item.value}
                    unit={item.unit}
                    icon={item.icon}
                />
            ))}
        </Box>
    );
};

export default DataBars;