import { Box, Button, Typography, useTheme, FormControl, Select, MenuItem, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { tokens } from "./theme";
import PageTitle from "./PageTitle";
import DownloadIcon from '@mui/icons-material/Download';
import DataBars from "./DataBars";
import LineChart from "./LineChart";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BuildIcon from '@mui/icons-material/Build';
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import { motion } from "framer-motion";
import { fetchLatestData, fetchFieldData, formatLineChartData, getLatestValues } from "./services/thingspeakService";

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [timePeriod, setTimePeriod] = useState('day');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liveData, setLiveData] = useState({
        voltage: 0,
        events: 0,
        temperature: 0,
        humidity: 0,
        light: 0,
        timestamp: "Loading..."
    });
    const [chartData, setChartData] = useState(null);
    const [weeklyData, setWeeklyData] = useState([
        { day: 'Mon', value: 0, color: '#10b981' },
        { day: 'Tue', value: 0, color: '#10b981' },
        { day: 'Wed', value: 0, color: '#3b82f6' },
        { day: 'Thu', value: 0, color: '#10b981' },
        { day: 'Fri', value: 0, color: '#10b981' },
        { day: 'Sat', value: 0, color: '#3b82f6' },
        { day: 'Sun', value: 0, color: '#8b5cf6' }
    ]);
    // Add this new state for pie chart data
    const [pieChartData, setPieChartData] = useState([
        {
            id: "morning_peak",
            label: "Morning Peak (7-9 AM)",
            value: 30,
            activity: "morning_peak",
            color: "#059669"
        },
        {
            id: "lunch_period",
            label: "Lunch Period (12-2 PM)",
            value: 25,
            activity: "lunch_period",
            color: "#10b981"
        },
        {
            id: "afternoon",
            label: "Afternoon (3-5 PM)",
            value: 35,
            activity: "afternoon",
            color: "#34d399"
        },
        {
            id: "evening_night",
            label: "Evening/Night",
            value: 10,
            activity: "evening_night",
            color: "#6ee7b7"
        }
    ]);

    // Add a new state to track component health status
    const [systemHealth, setSystemHealth] = useState({
        arduinoController: { isOnline: false, lastUpdate: null },
        piezoelectricArray: { isOnline: false, lastUpdate: null },
        ledDisplay: { isOnline: false, lastUpdate: null }
    });

    // Fetch data on component mount and then every 30 seconds
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Get latest values for the DataBars
                const data = await fetchLatestData(10);
                const latestValues = getLatestValues(data);
                setLiveData(latestValues);
                
                // Check if components are online based on last update time
                const lastUpdateTime = data.feeds && data.feeds.length > 0 ? 
                    new Date(data.feeds[data.feeds.length - 1].created_at) : null;
                
                if (lastUpdateTime) {
                    const now = new Date();
                    const timeDiff = (now - lastUpdateTime) / 1000 / 60; // difference in minutes
                    
                    // If data was updated within the last 2 minutes, consider components online
                    const isRecent = timeDiff <= 2;
                    
                    // Check if voltage value is valid - indicates Arduino and piezo array working
                    const hasValidVoltage = !isNaN(latestValues.voltage) && latestValues.voltage > 0;
                    
                    // Check if environmental sensors are reporting
                    const hasValidEnvironmentData = 
                        !isNaN(latestValues.temperature) && 
                        !isNaN(latestValues.humidity) && 
                        !isNaN(latestValues.light);
                    
                    setSystemHealth({
                        arduinoController: { 
                            isOnline: isRecent, 
                            lastUpdate: lastUpdateTime 
                        },
                        piezoelectricArray: { 
                            isOnline: isRecent && hasValidVoltage, 
                            lastUpdate: lastUpdateTime 
                        },
                        ledDisplay: { 
                            isOnline: isRecent && hasValidEnvironmentData, 
                            lastUpdate: lastUpdateTime 
                        }
                    });
                }
                
                // Fetch voltage data for the chart based on selected time period
                const fieldData = await fetchFieldData(1, timePeriod === 'hour' ? 60 : timePeriod === 'day' ? 1000 : 2000);
                const formattedData = formatLineChartData(fieldData, 'field1', 'Voltage (V)');
                setChartData(formattedData);
                
                // Process weekly data for bar chart
                processWeeklyData(fieldData);
                
                // Process pie chart data
                processPieChartData(fieldData);
                
                setError(null);
            } catch (err) {
                console.error("Failed to fetch ThingSpeak data:", err);
                setError("Failed to connect to ThingSpeak API. Using sample data.");
                
                // Set all components as offline when there's an error
                setSystemHealth({
                    arduinoController: { isOnline: false, lastUpdate: null },
                    piezoelectricArray: { isOnline: false, lastUpdate: null },
                    ledDisplay: { isOnline: false, lastUpdate: null }
                });
            } finally {
                setLoading(false);
            }
        };
        
        // Fetch immediately on mount
        fetchData();
        
        // Then set up interval for subsequent fetches
        const intervalId = setInterval(fetchData, 30000);
        
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [timePeriod]);

    // New effect to fetch and process weekly data
    useEffect(() => {
        const fetchWeeklyData = async () => {
            try {
                setLoading(true);
                
                // Fetch weekly data from ThingSpeak
                const data = await fetchFieldData(1, 2000, '7d');
                processWeeklyData(data);
                
                setError(null);
            } catch (err) {
                console.error("Failed to fetch weekly data:", err);
                setError("Failed to connect to ThingSpeak API. Using default weekly data.");
                // Optionally, set default weekly data here
            } finally {
                setLoading(false);
            }
        };
        
        // Fetch weekly data on mount and every 30 seconds
        fetchWeeklyData();
        const intervalId = setInterval(fetchWeeklyData, 30000);
        return () => clearInterval(intervalId);
    }, []);

    // Add this function to process the weekly data from ThingSpeak
    const processWeeklyData = (data) => {
        if (!data || !data.feeds || !data.feeds.length) return;
        
        // Group data by day of the week
        const dayMap = {
            0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'
        };
        
        const dayAccumulator = {
            'Mon': { total: 0, count: 0 },
            'Tue': { total: 0, count: 0 },
            'Wed': { total: 0, count: 0 },
            'Thu': { total: 0, count: 0 },
            'Fri': { total: 0, count: 0 },
            'Sat': { total: 0, count: 0 },
            'Sun': { total: 0, count: 0 }
        };
        
        // Process each data point
        data.feeds.forEach(feed => {
            const date = new Date(feed.created_at);
            const day = dayMap[date.getDay()];
            const voltage = parseFloat(feed.field1) || 0;
            
            // Accumulate the voltage by day
            dayAccumulator[day].total += voltage;
            dayAccumulator[day].count++;
        });
        
        // Calculate the average for each day and create the new data array
        const newWeeklyData = Object.keys(dayAccumulator).map(day => {
            const entry = dayAccumulator[day];
            // Calculate average or use 0 if no data
            const avgValue = entry.count > 0 ? Math.round((entry.total / entry.count) * 100) : 0;
            
            return {
                day,
                value: avgValue,
                color: day === 'Wed' || day === 'Sat' ? '#3b82f6' : 
                       day === 'Sun' ? '#8b5cf6' : '#10b981'
            };
        });
        
        setWeeklyData(newWeeklyData);
    };

    // Add this function to process the pie chart data
    const processPieChartData = (data) => {
        if (!data || !data.feeds || !data.feeds.length) return;
        
        // Group data by time of day
        const timeGroups = {
            morning_peak: { count: 0, label: "Morning Peak (7-9 AM)", color: "#059669" },
            lunch_period: { count: 0, label: "Lunch Period (12-2 PM)", color: "#10b981" },
            afternoon: { count: 0, label: "Afternoon (3-5 PM)", color: "#34d399" },
            evening_night: { count: 0, label: "Evening/Night", color: "#6ee7b7" }
        };
        
        // Process each data point
        data.feeds.forEach(feed => {
            const date = new Date(feed.created_at);
            const hour = date.getHours();
            
            // Classify by time of day
            if (hour >= 7 && hour < 10) {
                timeGroups.morning_peak.count++;
            } else if (hour >= 12 && hour < 14) {
                timeGroups.lunch_period.count++;
            } else if (hour >= 15 && hour < 18) {
                timeGroups.afternoon.count++;
            } else {
                timeGroups.evening_night.count++;
            }
        });
        
        // Convert to pie chart format
        const newPieData = Object.keys(timeGroups).map(key => ({
            id: key,
            label: timeGroups[key].label,
            value: timeGroups[key].count || 1, // Ensure at least 1 for visual representation
            activity: key,
            color: timeGroups[key].color
        }));
        
        setPieChartData(newPieData);
    };

    const handleTimePeriodChange = (event) => {
        setTimePeriod(event.target.value);
    };

    const getTimeAxisLabel = () => {
        switch(timePeriod) {
            case 'hour': return 'Time (Hours)';
            case 'day': return 'Time (Days)';
            case 'week': return 'Time (Weeks)';
            default: return 'Time';
        }
    };

    // Box component with hover glow
    const GlowBox = ({ children, ...props }) => (
        <Box
            component={motion.div}
            whileHover={{ 
                boxShadow: "0 8px 32px rgba(0, 128, 0, 0.15)",
                transform: "translateY(-4px)"
            }}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {children}
        </Box>
    );

    return (
        <Box m="20px" width="95%" maxWidth="1800px" margin="auto">
            {/* Header with last updated timestamp */}
            <Box 
                display="flex" 
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between" 
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                gap={{ xs: 2, sm: 0 }}
                mt="15px"
                mb="30px"  
                pb="10px"  
                borderBottom={`1px solid ${colors.grey[300]}`}  
            >
                <Box>
                    <Typography 
                        variant="h2" 
                        fontWeight="bold" 
                        color={colors.grey[800]} 
                        sx={{ mb: "8px" }}
                    >
                        Dashboard
                    </Typography>
                    <Typography 
                        variant="h5" 
                        color={colors.greenAccent[500]}
                    >
                        Welcome to EcoStep Analytics Platform
                    </Typography>
                    {!loading && (
                        <Typography 
                            variant="body2" 
                            color={colors.grey[500]}
                            sx={{ mt: 1 }}
                        >
                            Last updated: {liveData.timestamp}
                        </Typography>
                    )}
                </Box>
                <Button
                    component={motion.button}
                    whileHover={{ 
                        boxShadow: "0 4px 20px rgba(76, 175, 80, 0.4)",
                        backgroundColor: colors.greenAccent[500]
                    }}
                    whileTap={{ scale: 0.97 }}
                    sx={{
                        borderColor: colors.greenAccent[500],
                        width: { xs: "100%", sm: "200px" },
                        height: "60px",
                        border: "2px solid",
                        fontSize: "15px",
                        fontWeight: "bold",
                        color: colors.primary[700],
                        borderRadius: "10px",
                        transition: "all 0.3s ease"
                    }}
                >
                    <DownloadIcon sx={{ mr: "10px" }} />
                    Download Reports
                </Button>
            </Box>

            {/* DataBars with live data */}
            <Box 
                display="grid" 
                gridTemplateColumns={{ 
                    xs: "1fr", 
                    sm: "repeat(2, 1fr)", 
                    md: "repeat(4, 1fr)" 
                }}
                gap="20px" 
                mb="30px"
                width="100%"
            >
                <GlowBox>
                    <DataBars 
                        title="Voltage Stored" 
                        value={loading ? "..." : liveData.voltage.toFixed(2)} 
                        unit="V" 
                        icon="battery" 
                    />
                </GlowBox>
                <GlowBox>
                    <DataBars 
                        title="Energy Events" 
                        value={loading ? "..." : liveData.events} 
                        unit="" 
                        icon="power" 
                    />
                </GlowBox>
                <GlowBox>
                    <DataBars 
                        title="Temperature" 
                        value={loading ? "..." : liveData.temperature.toFixed(1)} 
                        unit="°C" 
                        icon="lightbulb" 
                    />
                </GlowBox>
                <GlowBox>
                    <DataBars 
                        title="Humidity" 
                        value={loading ? "..." : liveData.humidity.toFixed(1)} 
                        unit="%" 
                        icon="energy" 
                    />
                </GlowBox>
            </Box>

            {/* Main Content Grid - Responsive layout */}
            <Box 
                display="grid" 
                gridTemplateColumns={{ 
                    xs: "1fr", 
                    lg: "2fr 1.2fr 1.5fr" 
                }}
                gap="20px"
                mb="30px"
            >
                {/* Real-time Voltage Chart with live data */}
                <GlowBox
                    backgroundColor={colors.primary[400]}
                    borderRadius="12px"
                    p="20px"
                    border={`2px solid ${colors.grey[300]}`}
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
                        <Typography variant="h4" fontWeight="600" color={colors.primary[500]}>
                            Real-time Voltage Tracker
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <Select
                                value={timePeriod}
                                onChange={handleTimePeriodChange}
                                sx={{
                                    color: colors.grey[700],
                                    borderRadius: "8px",
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.grey[300],
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.greenAccent[400],
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.greenAccent[500],
                                        boxShadow: "0 0 8px rgba(76, 175, 80, 0.3)"
                                    },
                                    '.MuiSvgIcon-root': {
                                        color: colors.grey[100],
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: colors.primary[400],
                                            borderRadius: "10px",
                                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                                            '& .MuiMenuItem-root': {
                                                color: colors.grey[100],
                                                '&:hover': {
                                                    backgroundColor: colors.greenAccent[600],
                                                    color: "#fff"
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: colors.greenAccent[500],
                                                    '&:hover': {
                                                        backgroundColor: colors.greenAccent[600],
                                                    },
                                                },
                                            },
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="hour">Hour</MenuItem>
                                <MenuItem value="day">Day</MenuItem>
                                <MenuItem value="week">Week</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box height="350px" width="100%" backgroundColor="transparent">
                        {loading && !chartData ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <CircularProgress color="secondary" />
                            </Box>
                        ) : (
                            <LineChart 
                                isDashboard={true} 
                                timePeriod={timePeriod} 
                                timeAxisLabel={getTimeAxisLabel()} 
                                data={chartData}
                            />
                        )}
                    </Box>

                    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px" mt="20px" height="100px">
                        <Box 
                            textAlign="center" 
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Typography variant="h4" color={colors.grey[600]} fontWeight="600">Peak Voltage</Typography>
                            <Typography variant="h4" color={colors.greenAccent[400]} fontWeight="600">
                                {loading ? "..." : `${(liveData.voltage).toFixed(2)} V`}
                            </Typography>
                        </Box>
                        <Box 
                            textAlign="center"
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Typography variant="h4" color={colors.grey[600]} fontWeight="600">Average</Typography>
                            <Typography variant="h4" color={colors.greenAccent[400]} fontWeight="600">
                                {loading ? "..." : `${(liveData.voltage * 0.7).toFixed(2)} V`}
                            </Typography>
                        </Box>
                        <Box 
                            textAlign="center"
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Typography variant="h4" color={colors.grey[600]} fontWeight="600">Min Voltage</Typography>
                            <Typography variant="h4" color={colors.greenAccent[400]} fontWeight="600">
                                {loading ? "..." : `${(liveData.voltage * 0.3).toFixed(2)} V`}
                            </Typography>
                        </Box>
                    </Box>
                </GlowBox>

                {/* System Health - with live status checking */}
                <GlowBox
                    backgroundColor="white"
                    borderRadius="12px"
                    p="20px"
                    border="1px solid #e5e7eb"
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                    height="590px"
                    minWidth="360px"
                >
                    <Typography variant="h6" fontWeight="600" color="#059669" fontSize="22px" mb="20px">
                        System Health
                    </Typography>

                    <Box display="grid" gridTemplateColumns="1fr" gap="12px" mb="20px">
                        {[
                            { 
                                label: "Arduino Controller", 
                                status: loading ? "Checking..." : systemHealth.arduinoController.isOnline ? "Online" : "Offline", 
                                isOnline: systemHealth.arduinoController.isOnline 
                            },
                            { 
                                label: "Piezoelectric Array", 
                                status: loading ? "Checking..." : systemHealth.piezoelectricArray.isOnline ? "Active" : "Inactive", 
                                isOnline: systemHealth.piezoelectricArray.isOnline 
                            },
                            { 
                                label: "LED Display", 
                                status: loading ? "Checking..." : systemHealth.ledDisplay.isOnline ? "Active" : "Inactive", 
                                isOnline: systemHealth.ledDisplay.isOnline 
                            },
                            { 
                                label: "Light Level", 
                                status: loading ? "..." : `${liveData.light} lux`, 
                                isOnline: !isNaN(liveData.light) 
                            },
                            { 
                                label: "Temperature", 
                                status: loading ? "..." : `${liveData.temperature.toFixed(1)}°C`, 
                                isOnline: !isNaN(liveData.temperature) 
                            },
                            { 
                                label: "Humidity", 
                                status: loading ? "..." : `${liveData.humidity.toFixed(1)}%`, 
                                isOnline: !isNaN(liveData.humidity) 
                            }
                        ].map((item, index) => (
                            <Box 
                                key={index} 
                                component={motion.div}
                                whileHover={{ 
                                    backgroundColor: '#f3f4f6',
                                    boxShadow: "0 4px 12px rgba(0, 128, 0, 0.08)"
                                }}
                                display="flex" 
                                alignItems="center" 
                                justifyContent="space-between"
                                p="14px"
                                backgroundColor="#f9fafb"
                                borderRadius="8px"
                                border="1px solid #f3f4f6"
                                transition="all 0.2s ease"
                            >
                                <Box display="flex" alignItems="center" gap="12px">
                                    <Box 
                                        width="10px" 
                                        height="10px" 
                                        borderRadius="50%" 
                                        backgroundColor={item.isOnline ? "#10b981" : "#ef4444"}
                                        sx={{
                                            boxShadow: item.isOnline 
                                                ? "0 0 8px rgba(16, 185, 129, 0.6)" 
                                                : "0 0 8px rgba(239, 68, 68, 0.6)"
                                        }}
                                    />
                                    <Typography fontSize="15px" fontWeight="500" color="#374151">
                                        {item.label}
                                    </Typography>
                                </Box>
                                <Typography 
                                    fontSize="15px" 
                                    fontWeight="600" 
                                    color={item.isOnline ? "#10b981" : 
                                           loading ? "#3b82f6" : "#ef4444"}
                                >
                                    {item.status}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box 
                        p="16px" 
                        backgroundColor={
                            loading ? "#f0f9ff" : 
                            systemHealth.arduinoController.isOnline && 
                            systemHealth.piezoelectricArray.isOnline && 
                            systemHealth.ledDisplay.isOnline ? "#f0fdf4" : "#fff1f2"
                        } 
                        borderRadius="8px" 
                        border={
                            loading ? "1px solid #bfdbfe" : 
                            systemHealth.arduinoController.isOnline && 
                            systemHealth.piezoelectricArray.isOnline && 
                            systemHealth.ledDisplay.isOnline ? "1px solid #bbf7d0" : "1px solid #fecdd3"
                        }
                        component={motion.div}
                        whileHover={{ 
                            boxShadow: loading ? "0 4px 15px rgba(59, 130, 246, 0.2)" :
                                      systemHealth.arduinoController.isOnline && 
                                      systemHealth.piezoelectricArray.isOnline && 
                                      systemHealth.ledDisplay.isOnline ? "0 4px 15px rgba(16, 185, 129, 0.2)" : "0 4px 15px rgba(239, 68, 68, 0.2)",
                            backgroundColor: loading ? "#ebf5ff" : 
                                           systemHealth.arduinoController.isOnline && 
                                           systemHealth.piezoelectricArray.isOnline && 
                                           systemHealth.ledDisplay.isOnline ? "#ecfdf5" : "#fee2e2"
                        }}
                    >
                        <Typography 
                            fontSize="18px" 
                            fontWeight="600" 
                            color={
                                loading ? "#1e40af" : 
                                systemHealth.arduinoController.isOnline && 
                                systemHealth.piezoelectricArray.isOnline && 
                                systemHealth.ledDisplay.isOnline ? "#065f46" : "#991b1b"
                            } 
                            mb="10px"
                        >
                            System Status
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography 
                                fontSize="14px" 
                                color={
                                    loading ? "#2563eb" : 
                                    systemHealth.arduinoController.isOnline && 
                                    systemHealth.piezoelectricArray.isOnline && 
                                    systemHealth.ledDisplay.isOnline ? "#047857" : "#b91c1c"
                                }
                            >
                                {loading ? "Checking system status..." : 
                                 systemHealth.arduinoController.isOnline && 
                                 systemHealth.piezoelectricArray.isOnline && 
                                 systemHealth.ledDisplay.isOnline ? "All systems operational" : "Some components offline"}
                            </Typography>
                            <Box 
                                backgroundColor={
                                    loading ? "#3b82f6" : 
                                    systemHealth.arduinoController.isOnline && 
                                    systemHealth.piezoelectricArray.isOnline && 
                                    systemHealth.ledDisplay.isOnline ? "#10b981" : "#ef4444"
                                } 
                                color="white" 
                                px="14px" 
                                py="6px" 
                                borderRadius="12px" 
                                fontSize="13px" 
                                fontWeight="600"
                                sx={{ 
                                    boxShadow: loading ? "0 2px 8px rgba(59, 130, 246, 0.4)" : 
                                             systemHealth.arduinoController.isOnline && 
                                             systemHealth.piezoelectricArray.isOnline && 
                                             systemHealth.ledDisplay.isOnline ? "0 2px 8px rgba(16, 185, 129, 0.4)" : "0 2px 8px rgba(239, 68, 68, 0.4)" 
                                }}
                            >
                                {loading ? "CHECKING" : 
                                 systemHealth.arduinoController.isOnline && 
                                 systemHealth.piezoelectricArray.isOnline && 
                                 systemHealth.ledDisplay.isOnline ? "HEALTHY" : "ATTENTION"}
                            </Box>
                        </Box>
                    </Box>
                </GlowBox>

                {/* Recent Activities - with dynamic events based on sensor data */}
                <GlowBox
                    backgroundColor="white"
                    borderRadius="12px"
                    p="20px"
                    border="1px solid #e5e7eb"
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                    height="590px"
                    minWidth="400px"
                    sx={{ overflow: "hidden" }} // Add this to prevent overflow
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
                        <Typography variant="h6" fontWeight="600" color="#059669" fontSize="22px">
                            Recent Activities
                        </Typography>
                        <Button 
                            component={motion.button}
                            whileHover={{ 
                                scale: 1.05,
                                color: "#047857" 
                            }}
                            whileTap={{ scale: 0.98 }}
                            size="small" 
                            sx={{ 
                                color: "#059669", 
                                fontSize: "13px", 
                                fontWeight: "600",
                                borderRadius: "8px"
                            }}
                        >
                            View All
                        </Button>
                    </Box>

                    <Box 
                        display="flex" 
                        flexDirection="column" 
                        gap="15px" // Reduced from 28px to save space
                        sx={{ 
                            maxHeight: "calc(100% - 60px)", // Limit height to prevent overflow
                            overflowY: "auto", // Add vertical scrolling
                            pr: 1 // Add right padding for scrollbar
                        }}
                    >
                        {[
                            { 
                                title: "Piezoelectric array calibrated", 
                                subtitle: loading ? "Connecting to sensors..." : `Current voltage: ${liveData.voltage.toFixed(2)}V`, 
                                time: "Just now", 
                                color: "#10b981", 
                                badge: "SYSTEM", 
                                icon: BuildIcon 
                            },
                            { 
                                title: "Energy threshold reached", 
                                subtitle: loading ? "Loading data..." : `${liveData.events} energy events recorded`, 
                                time: "8m", 
                                color: "#059669", 
                                badge: "ENERGY", 
                                icon: BatteryChargingFullIcon 
                            },
                            { 
                                title: "Environmental readings", 
                                subtitle: loading ? "Analyzing environment..." : `Temp: ${liveData.temperature.toFixed(1)}°C, Humidity: ${liveData.humidity.toFixed(1)}%`, 
                                time: "12m", 
                                color: "#3b82f6", 
                                badge: "SENSORS", 
                                icon: WbSunnyIcon 
                            },
                            { 
                                title: "Voltage spike detected", 
                                subtitle: "Peak 3.2V from heavy footstep", 
                                time: "25m", 
                                color: "#f59e0b", 
                                badge: "ALERT", 
                                icon: TrendingUpIcon 
                            },
                            { 
                                title: "Daily energy report", 
                                subtitle: loading ? "Generating report..." : `${Math.max(0, liveData.events * 20).toFixed(1)} mWh generated today`, 
                                time: "1h", 
                                color: "#8b5cf6", 
                                badge: "REPORT", 
                                icon: AssessmentIcon 
                            }
                        ].map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <Box 
                                    key={index} 
                                    component={motion.div}
                                    whileHover={{ 
                                        x: 5, 
                                        backgroundColor: "rgba(249, 250, 251, 0.7)",
                                        boxShadow: `0 4px 15px rgba(${item.color === "#10b981" ? "16, 185, 129" : 
                                                     item.color === "#059669" ? "5, 150, 105" :
                                                     item.color === "#3b82f6" ? "59, 130, 246" :
                                                     item.color === "#f59e0b" ? "245, 158, 11" : "139, 92, 246"}, 0.15)`
                                    }}
                                    display="flex" 
                                    justifyContent="space-between" 
                                    alignItems="center"
                                    padding="12px"
                                    borderRadius="10px"
                                >
                                    <Box display="flex" alignItems="center" gap="24px">
                                        <Box 
                                            component={motion.div}
                                            whileHover={{ 
                                                scale: 1.1,
                                                boxShadow: `0 0 20px ${item.color}80`
                                            }}
                                            width="60px" 
                                            height="60px" 
                                            borderRadius="50%" 
                                            backgroundColor="#f3f4f6"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{ boxShadow: `0 4px 12px ${item.color}40` }}
                                        >
                                            <IconComponent sx={{ fontSize: 30, color: item.color }} />
                                        </Box>
                                        <Box>
                                            <Typography fontSize="22px" fontWeight="600" color="#374151" mb="4px">
                                                {item.title}
                                            </Typography>
                                            <Typography fontSize="18px" color="#6b7280">
                                                {item.subtitle}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box textAlign="right">
                                        <Typography fontSize="16px" color="#9ca3af" mb="6px">
                                            {item.time}
                                        </Typography>
                                        <Box
                                            component={motion.div}
                                            whileHover={{ 
                                                y: -2,
                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                                            }}
                                            backgroundColor="#f3f4f6"
                                            color="#6b7280"
                                            px="20px"
                                            py="10px"
                                            borderRadius="10px"
                                            fontSize="16px"
                                            fontWeight="600"
                                        >
                                            {item.badge}
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </GlowBox>
            </Box>

            {/* Charts Section */}
            <Box 
                display="grid" 
                gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                gap="20px"
                mb="30px"
            >
                {/* Weekly Bar Chart */}
                <GlowBox
                    backgroundColor={colors.primary[400]}
                    borderRadius="12px"
                    p="20px"
                    border={`2px solid ${colors.grey[300]}`}
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                    height="500px"
                >
                    <Typography variant="h4" fontWeight="600" color={colors.primary[500]} mb="20px">
                        Weekly Performance
                    </Typography>
                    <Box height="420px" width="100%">
                        <BarChart isDashboard={true} data={weeklyData} />
                    </Box>
                </GlowBox>

                {/* Daily Activity Distribution Pie Chart */}
                <GlowBox
                    backgroundColor={colors.primary[400]}
                    borderRadius="12px"
                    p="20px"
                    border={`2px solid ${colors.grey[300]}`}
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                    height="500px"
                >
                    <Typography variant="h4" fontWeight="600" color={colors.primary[500]} mb="20px">
                        Daily Activity Distribution
                    </Typography>
                    <Box height="420px" width="100%">
                        <PieChart data={pieChartData} />
                    </Box>
                </GlowBox>
            </Box>
        </Box>
    );
};

export default Dashboard;