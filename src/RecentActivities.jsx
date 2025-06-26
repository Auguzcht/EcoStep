import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "./theme";

const RecentActivities = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Activity data - easy to update and modify
    const activities = [
        { 
            title: "Peak demand detected", 
            subtitle: "System automatically adjusted", 
            time: "5 minutes ago", 
            color: "#8B4513", // Brown
            icon: "⚡"
        },
        { 
            title: "Energy storage optimized", 
            subtitle: "Battery efficiency improved", 
            time: "2 hours ago", 
            color: "#D2691E", // Orange
            icon: "🔋"
        },
        { 
            title: "Low voltage alert", 
            subtitle: "Sensor array #3", 
            time: "3 hours ago", 
            color: "#B22222", // Dark red
            icon: "⚠️"
        },
        { 
            title: "Weather update received", 
            subtitle: "Sunny forecast for next 6 hours", 
            time: "4 hours ago", 
            color: "#DAA520", // Goldenrod
            icon: "☀️"
        },
        { 
            title: "System backup completed", 
            subtitle: "All data synchronized", 
            time: "6 hours ago", 
            color: "#556B2F", // Dark olive green
            icon: "💾"
        },
        { 
            title: "Piezoelectric array calibrated", 
            subtitle: "Performance increased by 12%", 
            time: "Yesterday", 
            color: "#CD853F", // Peru brown
            icon: "🔧"
        }
    ];

    return (
        <Box
            backgroundColor={colors.primary[400]}
            borderRadius="8px"
            p="20px"
            border={`2px solid ${colors.grey[300]}`}
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
        >
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
                <Typography
                    variant="h6"
                    fontWeight="600"
                    color={colors.grey[100]}
                >
                    Recent Activities
                </Typography>
                <Button size="small" sx={{ color: colors.greenAccent[400] }}>
                    View All
                </Button>
            </Box>

            {/* Activities List */}
            <Box display="flex" flexDirection="column" gap="15px">
                {activities.map((item, index) => (
                    <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap="15px">
                            {/* Circular Icon */}
                            <Box 
                                width="45px" 
                                height="45px" 
                                borderRadius="50%" 
                                backgroundColor={item.color}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="18px"
                            >
                                {item.icon}
                            </Box>
                            
                            {/* Activity Details */}
                            <Box>
                                <Typography 
                                    variant="body1" 
                                    color={colors.grey[100]} 
                                    fontWeight="600" 
                                    fontSize="14px"
                                >
                                    {item.title}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    color={colors.grey[300]} 
                                    fontSize="12px"
                                >
                                    {item.subtitle}
                                </Typography>
                            </Box>
                        </Box>
                        
                        {/* Timestamp */}
                        <Box textAlign="right">
                            <Typography 
                                variant="caption" 
                                color={colors.grey[400]} 
                                fontSize="11px"
                            >
                                {item.time}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default RecentActivities;