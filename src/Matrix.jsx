import { useState, useEffect } from 'react';
import { Box, Typography, useTheme, LinearProgress, CircularProgress, Alert } from '@mui/material';
import { fetchLatestData, getLatestValues } from './services/thingspeakService';

const Matrix = () => {
    const theme = useTheme();
    const [matrix, setMatrix] = useState(Array(8).fill().map(() => Array(8).fill(0)));
    const [isSimulating, setIsSimulating] = useState(true);
    const [currentPressure, setCurrentPressure] = useState(0);
    const [currentVoltage, setCurrentVoltage] = useState(0);
    const [batteryLevel, setBatteryLevel] = useState(78);
    const [voltageHistory, setVoltageHistory] = useState(Array(20).fill(0));
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
    
    // Track system connection status
    const [isConnected, setIsConnected] = useState(true);
    const [lastUpdateTime, setLastUpdateTime] = useState(null);
    
    // Track when we last received data
    const [dataStaleTimeout, setDataStaleTimeout] = useState(null);

    // Common foot pressure patterns - represents the most common areas where pressure occurs
    const commonPressurePatterns = [
        // Heel pattern
        [
            { row: 6, col: 3, intensityFactor: 0.9 },
            { row: 6, col: 4, intensityFactor: 0.9 },
            { row: 7, col: 3, intensityFactor: 1.0 },
            { row: 7, col: 4, intensityFactor: 1.0 }
        ],
        // Ball of foot pattern
        [
            { row: 2, col: 2, intensityFactor: 0.8 },
            { row: 2, col: 3, intensityFactor: 0.9 },
            { row: 2, col: 4, intensityFactor: 0.8 },
            { row: 3, col: 2, intensityFactor: 0.9 },
            { row: 3, col: 3, intensityFactor: 1.0 },
            { row: 3, col: 4, intensityFactor: 0.9 }
        ],
        // Toe pattern
        [
            { row: 0, col: 2, intensityFactor: 0.7 },
            { row: 0, col: 3, intensityFactor: 0.8 },
            { row: 0, col: 4, intensityFactor: 0.7 },
            { row: 1, col: 2, intensityFactor: 0.6 },
            { row: 1, col: 3, intensityFactor: 0.7 },
            { row: 1, col: 4, intensityFactor: 0.6 }
        ]
    ];
    
    // Function to check if data is stale
    const checkDataFreshness = () => {
        if (!lastUpdateTime) return;
        
        const now = new Date();
        const lastUpdate = new Date(lastUpdateTime);
        const diffMinutes = (now - lastUpdate) / (1000 * 60);
        
        // If data is more than 2 minutes old, consider the system disconnected
        if (diffMinutes > 2) {
            setIsConnected(false);
            
            // Clear the matrix when disconnected
            if (isSimulating) {
                setMatrix(Array(8).fill().map(() => Array(8).fill(0)));
            }
        }
    };
    
    // Fetch real data from ThingSpeak every 30 seconds
    useEffect(() => {
        const fetchRealData = async () => {
            try {
                setLoading(true);
                
                // Get latest values from ThingSpeak
                const data = await fetchLatestData(10);
                const latestValues = getLatestValues(data);
                
                // Check if we got new data
                if (data.feeds && data.feeds.length > 0) {
                    const newUpdateTime = data.feeds[data.feeds.length - 1].created_at;
                    
                    // Only update if this is new data or first load
                    if (!lastUpdateTime || newUpdateTime !== lastUpdateTime) {
                        setLiveData(latestValues);
                        setCurrentVoltage(latestValues.voltage);
                        setVoltageHistory(prev => [...prev.slice(1), latestValues.voltage]);
                        
                        // Calculate battery level based on events and voltage
                        const calculatedLevel = Math.min(100, 50 + latestValues.events * 0.5);
                        setBatteryLevel(calculatedLevel);
                        
                        // Calculate pressure based on voltage (lower multiplier for smoother values)
                        const calculatedPressure = Math.min(100, latestValues.voltage * 25);
                        setCurrentPressure(calculatedPressure);
                        
                        // Update connection status and last update time
                        setIsConnected(true);
                        setLastUpdateTime(newUpdateTime);
                    }
                }
                
                setError(null);
            } catch (err) {
                console.error("Failed to fetch ThingSpeak data:", err);
                setError("Failed to connect to ThingSpeak API. Using simulation data.");
            } finally {
                setLoading(false);
                
                // Check data freshness after every fetch attempt
                checkDataFreshness();
            }
        };
        
        // Fetch data immediately on mount
        fetchRealData();
        
        // Set up interval for subsequent fetches - every 30 seconds
        const fetchInterval = setInterval(fetchRealData, 30000);
        
        // Set up a separate interval to check data freshness more frequently
        const freshnessInterval = setInterval(checkDataFreshness, 10000);
        
        // Clean up intervals on unmount
        return () => {
            clearInterval(fetchInterval);
            clearInterval(freshnessInterval);
        };
    }, [lastUpdateTime]);

    // Simulate pressure/activation on the matrix based on ThingSpeak data
    useEffect(() => {
        // Don't simulate if simulation is off or system is disconnected
        if (!isSimulating || !isConnected) return;

        const interval = setInterval(() => {
            setMatrix(prevMatrix => {
                const newMatrix = prevMatrix.map(row => [...row]);
                
                // Clear previous activations first - slower fade out
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        // Slower decay rate (5 instead of 20)
                        newMatrix[row][col] = Math.max(0, newMatrix[row][col] - 5); 
                    }
                }
                
                // Skip new activations if voltage is too low or loading
                if (loading || currentVoltage < 0.1) return newMatrix;
                
                // 50% chance of updating pattern to make changes less frequent and more realistic
                if (Math.random() > 0.5) {
                    // Use voltage to determine intensity
                    const intensityBase = currentVoltage * 60; // Reduced from 70 for more moderate values
                    
                    // Select a random pressure pattern
                    const patternIndex = Math.floor(Math.random() * commonPressurePatterns.length);
                    const selectedPattern = commonPressurePatterns[patternIndex];
                    
                    // Apply the selected pattern with intensity based on real voltage
                    selectedPattern.forEach(point => {
                        const { row, col, intensityFactor } = point;
                        const finalIntensity = Math.min(100, intensityBase * intensityFactor);
                        
                        // Add some randomness to cell position (slight movement) - reduced probability
                        const rowOffset = Math.random() > 0.8 ? Math.floor(Math.random() * 2) - 1 : 0;
                        const colOffset = Math.random() > 0.8 ? Math.floor(Math.random() * 2) - 1 : 0;
                        
                        const finalRow = Math.max(0, Math.min(7, row + rowOffset));
                        const finalCol = Math.max(0, Math.min(7, col + colOffset));
                        
                        // Set the intensity for this cell
                        newMatrix[finalRow][finalCol] = finalIntensity;
                    });
                }
                
                // Random additional activation reduced to 20% chance (from 70%)
                if (Math.random() > 0.8) {
                    const randomRow = Math.floor(Math.random() * 8);
                    const randomCol = Math.floor(Math.random() * 8);
                    const randomIntensity = currentVoltage * 50; // Lower intensity for random points
                    newMatrix[randomRow][randomCol] = randomIntensity;
                }
                
                return newMatrix;
            });
        }, 800); // Slower updates for more realistic movement (was 300ms)

        return () => clearInterval(interval);
    }, [isSimulating, currentVoltage, loading, isConnected]);

    // Get color based on intensity
    const getCellColor = (intensity) => {
        if (intensity === 0) {
            return '#1f2937'; // Dark gray for inactive
        } else if (intensity < 30) {
            return '#065f46'; // Dark green for low intensity
        } else if (intensity < 60) {
            return '#059669'; // Medium green
        } else if (intensity < 80) {
            return '#10b981'; // Bright green
        } else {
            return '#34d399'; // Very bright green for high intensity
        }
    };

    // Get cell opacity based on intensity
    const getCellOpacity = (intensity) => {
        return Math.max(0.3, intensity / 100);
    };

    const toggleSimulation = () => {
        setIsSimulating(!isSimulating);
    };

    const resetMatrix = () => {
        setMatrix(Array(8).fill().map(() => Array(8).fill(0)));
    };

    return (
        <Box 
            display="flex" 
            gap="30px"
            p="20px"
            flexDirection={{ xs: "column", lg: "row" }}
        >
            {/* Left Container - Matrix Grid */}
            <Box 
                flex="1"
                backgroundColor="white"
                borderRadius="12px"
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                border="1px solid #e5e7eb"
                p="20px"
                display="flex"
                flexDirection="column"
            >
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
                    <Box>
                        <Typography variant="h5" fontWeight="600" color="#059669">
                            8×8 Piezoelectric Matrix
                        </Typography>
                        {!isConnected && (
                            <Typography variant="body2" color="#ef4444" fontWeight="500">
                                System Offline - No Recent Data
                            </Typography>
                        )}
                    </Box>
                    <Box display="flex" gap="10px">
                        <Box
                            component="button"
                            onClick={toggleSimulation}
                            sx={{
                                px: "12px",
                                py: "6px",
                                backgroundColor: isSimulating ? "#ef4444" : "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                                '&:hover': {
                                    opacity: 0.8
                                }
                            }}
                        >
                            {isSimulating ? "PAUSE" : "START"}
                        </Box>
                        <Box
                            component="button"
                            onClick={resetMatrix}
                            sx={{
                                px: "12px",
                                py: "6px",
                                backgroundColor: "#6b7280",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                                '&:hover': {
                                    opacity: 0.8
                                }
                            }}
                        >
                            RESET
                        </Box>
                    </Box>
                </Box>

                {/* Connection Warning */}
                {!isConnected && (
                    <Alert 
                        severity="warning" 
                        sx={{ mb: 2 }}
                    >
                        No recent data received. The system appears to be offline or not generating voltage.
                    </Alert>
                )}

                {/* Matrix Grid */}
                <Box 
                    display="grid" 
                    gridTemplateColumns="repeat(8, 1fr)" 
                    gap="3px" 
                    p="20px"
                    backgroundColor="#f3f4f6"
                    borderRadius="8px"
                    border="2px solid #d1d5db"
                    width="650px"
                    height="650px"
                    margin="0 auto"
                    position="relative"
                    opacity={isConnected ? 1 : 0.6}
                >
                    {loading && (
                        <Box 
                            position="absolute" 
                            top="0" 
                            left="0" 
                            right="0" 
                            bottom="0" 
                            display="flex" 
                            alignItems="center" 
                            justifyContent="center"
                            backgroundColor="rgba(255,255,255,0.7)"
                            borderRadius="8px"
                            zIndex="1"
                        >
                            <CircularProgress color="success" />
                        </Box>
                    )}
                    {/* Show disconnected overlay */}
                    {!isConnected && !loading && (
                        <Box 
                            position="absolute" 
                            top="0" 
                            left="0" 
                            right="0" 
                            bottom="0" 
                            display="flex" 
                            flexDirection="column"
                            alignItems="center" 
                            justifyContent="center"
                            backgroundColor="rgba(255,255,255,0.7)"
                            borderRadius="8px"
                            zIndex="1"
                        >
                            <Typography variant="h5" color="#ef4444" fontWeight="bold" mb={2}>
                                System Offline
                            </Typography>
                            <Typography variant="body1" color="#6b7280" textAlign="center" px={4}>
                                No pressure data available. Please check the Arduino connection or ensure the piezoelectric array is generating voltage.
                            </Typography>
                        </Box>
                    )}
                    {matrix.map((row, rowIndex) =>
                        row.map((cellValue, colIndex) => (
                            <Box
                                key={`${rowIndex}-${colIndex}`}
                                width="70px"
                                height="70px"
                                backgroundColor={getCellColor(cellValue)}
                                borderRadius="4px"
                                border="1px solid #374151"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    opacity: getCellOpacity(cellValue),
                                    transition: 'all 0.5s ease', // Slower transition
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                                    }
                                }}
                                onClick={() => {
                                    if (!isSimulating) {
                                        setMatrix(prev => {
                                            const newMatrix = prev.map(row => [...row]);
                                            newMatrix[rowIndex][colIndex] = newMatrix[rowIndex][colIndex] > 0 ? 0 : 80;
                                            return newMatrix;
                                        });
                                    }
                                }}
                            >
                                {cellValue > 0 && (
                                    <Typography 
                                        fontSize="9px" 
                                        fontWeight="600" 
                                        color="white"
                                        sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                                    >
                                        {Math.round(cellValue)}
                                    </Typography>
                                )}
                            </Box>
                        ))
                    )}
                </Box>

                {/* Legend */}
                <Box mt="20px">
                    <Typography fontSize="16px" color="#374151" fontWeight="600" mb="15px">
                        Pressure Intensity Legend:
                    </Typography>
                    <Box display="flex" flexDirection="column" gap="10px">
                        <Box display="flex" alignItems="center" gap="10px">
                            <Box width="18px" height="18px" backgroundColor="#1f2937" borderRadius="3px" />
                            <Typography fontSize="13px" color="#6b7280" fontWeight="500">Inactive (0)</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="10px">
                            <Box width="18px" height="18px" backgroundColor="#065f46" borderRadius="3px" />
                            <Typography fontSize="13px" color="#6b7280" fontWeight="500">Low (1-29)</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="10px">
                            <Box width="18px" height="18px" backgroundColor="#059669" borderRadius="3px" />
                            <Typography fontSize="13px" color="#6b7280" fontWeight="500">Medium (30-59)</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="10px">
                            <Box width="18px" height="18px" backgroundColor="#10b981" borderRadius="3px" />
                            <Typography fontSize="13px" color="#6b7280" fontWeight="500">High (60-79)</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="10px">
                            <Box width="18px" height="18px" backgroundColor="#34d399" borderRadius="3px" />
                            <Typography fontSize="13px" color="#6b7280" fontWeight="500">Maximum (80-100)</Typography>
                        </Box>
                    </Box>
                    
                    {/* Status */}
                    <Box 
                        mt="20px" 
                        p="15px" 
                        backgroundColor={isConnected ? "#f0fdf4" : "#fff1f2"}
                        borderRadius="8px" 
                        border={isConnected ? "1px solid #bbf7d0" : "1px solid #fecdd3"}
                    >
                        <Typography 
                            fontSize="14px" 
                            color={isConnected ? "#065f46" : "#b91c1c"}
                            textAlign="center" 
                            fontWeight="600"
                        >
                            <strong>Status:</strong> {isConnected 
                                ? (isSimulating ? "Live Data Visualization" : "Manual Mode") 
                                : "System Offline"
                            }
                        </Typography>
                        <Typography 
                            fontSize="14px" 
                            color={isConnected ? "#065f46" : "#b91c1c"}
                            textAlign="center" 
                            mt="5px"
                        >
                            <strong>Active Sensors:</strong> {matrix.flat().filter(cell => cell > 0).length}/64
                        </Typography>
                        {!loading && liveData.timestamp && (
                            <Typography 
                                fontSize="14px" 
                                color={isConnected ? "#065f46" : "#b91c1c"}
                                textAlign="center" 
                                mt="5px"
                            >
                                <strong>Last Update:</strong> {liveData.timestamp}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Right Container - Live Feedback */}
            <Box 
                flex="1"
                backgroundColor="white"
                borderRadius="12px"
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                border="1px solid #e5e7eb"
                p="20px"
                display="flex"
                flexDirection="column"
                gap="20px"
                opacity={isConnected ? 1 : 0.7}
            >
                <Typography variant="h5" fontWeight="600" color="#059669" mb="10px">
                    Live Feedback Dashboard
                    {!isConnected && <span style={{ color: '#ef4444', fontSize: '0.8em', marginLeft: '10px' }}>(Offline)</span>}
                </Typography>

                {/* Pressure Gauge */}
                <Box p="25px" backgroundColor="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Typography variant="h6" fontWeight="600" color="#374151" mb="20px">
                        Pressure Gauge
                    </Typography>
                    <Box mb="15px">
                        <LinearProgress 
                            variant="determinate" 
                            value={isConnected ? currentPressure : 0} 
                            sx={{
                                height: 15,
                                borderRadius: 8,
                                backgroundColor: '#e5e7eb',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: currentPressure > 70 ? '#ef4444' : currentPressure > 40 ? '#f59e0b' : '#10b981',
                                    borderRadius: 8,
                                }
                            }}
                        />
                    </Box>
                    <Typography fontSize="28px" fontWeight="700" color="#374151" mb="5px">
                        {isConnected ? currentPressure.toFixed(1) : "0.0"}%
                    </Typography>
                    <Typography fontSize="14px" color="#6b7280">
                        {isConnected ? "Current pressure intensity" : "No pressure data available"}
                    </Typography>
                </Box>

                {/* Voltage Creation */}
                <Box p="25px" backgroundColor={isConnected ? "#f0fdf4" : "#f9fafb"} borderRadius="12px" border={isConnected ? "1px solid #bbf7d0" : "1px solid #e5e7eb"}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb="10px">
                        <Typography variant="h6" fontWeight="600" color={isConnected ? "#065f46" : "#6b7280"}>
                            Voltage Generation
                        </Typography>
                        {loading && <CircularProgress size={20} color="success" />}
                    </Box>
                    <Typography fontSize="36px" fontWeight="700" color={isConnected ? "#059669" : "#9ca3af"} mb="10px">
                        {isConnected ? currentVoltage.toFixed(2) : "0.00"}V
                    </Typography>
                    <Typography fontSize="14px" color={isConnected ? "#047857" : "#6b7280"} mb="10px">
                        {isConnected ? "Real-time voltage from ThingSpeak" : "No voltage data available"}
                    </Typography>
                    
                    {/* Mini voltage chart */}
                    <Box display="flex" alignItems="end" gap="3px" height="50px" width="100%" overflow="hidden">
                        {voltageHistory.map((voltage, index) => (
                            <Box
                                key={index}
                                flex="1"
                                backgroundColor={isConnected ? (voltage > 2.0 ? "#10b981" : "#34d399") : "#d1d5db"}
                                borderRadius="2px"
                                height={isConnected ? `${Math.max(3, (voltage / 5) * 50)}px` : "3px"}
                                sx={{ 
                                    opacity: isConnected ? (0.3 + (index / voltageHistory.length) * 0.7) : 0.4,
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        ))}
                    </Box>
                    
                    <Typography fontSize="12px" color={isConnected ? "#047857" : "#6b7280"} textAlign="right" mt="5px">
                        Events tracked: {isConnected ? (liveData.events || 0) : "N/A"}
                    </Typography>
                </Box>

                {/* Battery Level */}
                <Box p="25px" backgroundColor={isConnected ? "#fefce8" : "#f9fafb"} borderRadius="12px" border={isConnected ? "1px solid #fef3c7" : "1px solid #e5e7eb"}>
                    <Typography variant="h6" fontWeight="600" color={isConnected ? "#713f12" : "#6b7280"} mb="20px">
                        Battery Level
                    </Typography>
                    <Box mb="15px">
                        <LinearProgress 
                            variant="determinate" 
                            value={isConnected ? batteryLevel : 0} 
                            sx={{
                                height: 15,
                                borderRadius: 8,
                                backgroundColor: '#e5e7eb',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: batteryLevel > 60 ? '#10b981' : batteryLevel > 30 ? '#f59e0b' : '#ef4444',
                                    borderRadius: 8,
                                }
                            }}
                        />
                    </Box>
                    <Typography fontSize="28px" fontWeight="700" color={isConnected ? "#713f12" : "#9ca3af"} mb="5px">
                        {isConnected ? batteryLevel.toFixed(1) : "0.0"}%
                    </Typography>
                    <Typography fontSize="14px" color={isConnected ? "#a16207" : "#6b7280"}>
                        Energy storage capacity
                    </Typography>
                    
                    {/* Additional insights */}
                    <Box 
                        mt="15px" 
                        p="10px" 
                        backgroundColor={isConnected ? "#fffbeb" : "#f9fafb"} 
                        borderRadius="8px" 
                        border={isConnected ? "1px solid #fef3c7" : "1px solid #e5e7eb"}
                    >
                        <Typography fontSize="13px" color={isConnected ? "#92400e" : "#6b7280"} lineHeight="1.5">
                            {isConnected ? 
                                `Battery level is calculated based on voltage generated and energy events.
                                ${liveData.events > 0 ? ` ${liveData.events} energy events have been recorded.` : ""}` :
                                "Battery data unavailable while system is offline."
                            }
                        </Typography>
                    </Box>
                </Box>
                
                {/* Environmental Data */}
                <Box p="25px" backgroundColor={isConnected ? "#f0f9ff" : "#f9fafb"} borderRadius="12px" border={isConnected ? "1px solid #bae6fd" : "1px solid #e5e7eb"}>
                    <Typography variant="h6" fontWeight="600" color={isConnected ? "#0c4a6e" : "#6b7280"} mb="20px">
                        Environmental Conditions
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mb="10px">
                        <Box>
                            <Typography fontSize="14px" color={isConnected ? "#0369a1" : "#6b7280"} mb="5px">
                                Temperature
                            </Typography>
                            <Typography fontSize="18px" fontWeight="600" color={isConnected ? "#0c4a6e" : "#9ca3af"}>
                                {isConnected ? (loading ? "..." : `${liveData.temperature.toFixed(1)}°C`) : "N/A"}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography fontSize="14px" color={isConnected ? "#0369a1" : "#6b7280"} mb="5px">
                                Humidity
                            </Typography>
                            <Typography fontSize="18px" fontWeight="600" color={isConnected ? "#0c4a6e" : "#9ca3af"}>
                                {isConnected ? (loading ? "..." : `${liveData.humidity.toFixed(1)}%`) : "N/A"}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography fontSize="14px" color={isConnected ? "#0369a1" : "#6b7280"} mb="5px">
                                Light Level
                            </Typography>
                            <Typography fontSize="18px" fontWeight="600" color={isConnected ? "#0c4a6e" : "#9ca3af"}>
                                {isConnected ? (loading ? "..." : `${liveData.light} lux`) : "N/A"}
                            </Typography>
                        </Box>
                    </Box>
                    
                    {/* Disconnected notice */}
                    {!isConnected && (
                        <Box mt={2} p={2} bgcolor="#f1f5f9" borderRadius="8px" textAlign="center">
                            <Typography fontSize="13px" color="#64748b">
                                Environmental sensors are currently offline. Check connections or battery level.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Matrix;