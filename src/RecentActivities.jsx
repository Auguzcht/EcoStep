import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "./theme";
import { motion } from "framer-motion";

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
        }
    ];

    return (
        <Box
            backgroundColor={colors.primary[400]}
            borderRadius="8px"
            p="20px"
            border={`2px solid ${colors.grey[300]}`}
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            height="500px" // Changed from 100px to 500px to fit items properly
            width="100%"
            maxWidth="100%" 
            overflow="hidden"
            display="flex"
            flexDirection="column"
        >
            {/* Header */}
            <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center" 
                mb="20px"
                width="100%"
            >
                <Typography
                    variant="h6"
                    fontWeight="600"
                    color={colors.grey[100]}
                    noWrap
                >
                    Recent Activities
                </Typography>
                <Button 
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    size="small" 
                    sx={{ 
                        color: colors.greenAccent[400],
                        minWidth: 'auto',
                        px: 2
                    }}
                >
                    View All
                </Button>
            </Box>

            {/* Activities List */}
            <Box 
                display="flex" 
                flexDirection="column" 
                gap="15px"
                sx={{ 
                    overflowY: "auto", 
                    overflowX: "hidden",
                    flex: 1,
                    pr: 1,
                    width: "100%",
                    maxHeight: "calc(100% - 60px)", // Ensure it doesn't overflow the parent
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: colors.primary[500],
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: colors.greenAccent[500],
                        borderRadius: '10px',
                    }
                }}
            >
                {activities.map((item, index) => (
                    <Box 
                        component={motion.div}
                        whileHover={{ 
                            backgroundColor: colors.primary[500],
                            x: 4,
                            transition: { duration: 0.2 }
                        }}
                        key={index} 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                        p="10px"
                        borderRadius="8px"
                        width="100%"
                        maxWidth="100%"
                        height="80px" // Changed from 100px to 80px
                        boxSizing="border-box"
                        sx={{
                            minWidth: 0,
                            transition: 'background-color 0.2s',
                            flexShrink: 0 // Prevent items from shrinking
                        }}
                    >
                        <Box 
                            display="flex" 
                            alignItems="center" 
                            gap="15px" 
                            sx={{ 
                                minWidth: 0,
                                maxWidth: "calc(100% - 80px)"
                            }}
                        >
                            {/* Circular Icon */}
                            <Box 
                                component={motion.div}
                                whileHover={{ scale: 1.1 }}
                                width="38px" 
                                height="38px" 
                                borderRadius="50%" 
                                backgroundColor={item.color}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="16px"
                                flexShrink={0}
                                sx={{ boxShadow: `0 2px 10px ${item.color}80` }}
                            >
                                {item.icon}
                            </Box>
                            
                            {/* Activity Details */}
                            <Box sx={{ 
                                minWidth: 0, 
                                overflow: 'hidden',
                                maxWidth: "100%"
                            }}>
                                <Typography 
                                    variant="body1" 
                                    color={colors.grey[100]} 
                                    fontWeight="600" 
                                    fontSize="14px"
                                    noWrap
                                    title={item.title}
                                    sx={{ 
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        width: '100%'
                                    }}
                                >
                                    {item.title}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    color={colors.grey[300]} 
                                    fontSize="12px"
                                    noWrap
                                    title={item.subtitle}
                                    sx={{ 
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        width: '100%',
                                        display: 'block'
                                    }}
                                >
                                    {item.subtitle}
                                </Typography>
                            </Box>
                        </Box>
                        
                        {/* Timestamp */}
                        <Box 
                            textAlign="right" 
                            flexShrink={0}
                            ml={1}
                            width="70px"
                        >
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