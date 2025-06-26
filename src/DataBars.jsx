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
        'battery': <BatteryFullIcon sx={{ fontSize: '2rem', color: colors.grey[100] }} />,
        'power': <FlashOnIcon sx={{ fontSize: '2rem', color: colors.grey[100] }} />,
        'lightbulb': <LightbulbOutlinedIcon sx={{ fontSize: '2rem', color: colors.grey[100]  }} />,
        'energy': <BatteryChargingFullIcon sx={{ fontSize: '2rem', color: colors.grey[100]  }} />
    };

    const getIcon = () => {
        if (typeof icon === 'string') {
            return iconMap[icon] || iconMap['battery'];
        }
        return icon;
    };

    return (
        <Box 
            width="520px"
            height="130px"
            m={0}
            p="20px"
            sx={{
                border: `2px solid ${colors.grey[400]}`,
                borderRadius: '8px',
                backgroundColor: colors.primary[400],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '80px',
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
            }}
        >
            <Box>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: colors.grey[600],
                        fontSize: '1.1rem',
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
                        fontSize: '2.5rem'
                    }}
                >
                    {value}{unit}
                </Typography>
            </Box>
            
            <Box
                sx={{
                    backgroundColor: colors.greenAccent[500],
                    borderRadius: '8px',
                    p: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '70px',
                    minHeight: '70px'
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