import { useState, useEffect } from 'react';
import { Box, Typography, useTheme, LinearProgress } from '@mui/material';

const Matrix = () => {
    const theme = useTheme();
    const [matrix, setMatrix] = useState(Array(8).fill().map(() => Array(8).fill(0)));
    const [isSimulating, setIsSimulating] = useState(true);
    const [currentPressure, setCurrentPressure] = useState(0);
    const [currentVoltage, setCurrentVoltage] = useState(0);
    const [batteryLevel, setBatteryLevel] = useState(78);
    const [voltageHistory, setVoltageHistory] = useState(Array(20).fill(0));

    // Simulate pressure/activation on the matrix
    useEffect(() => {
        if (!isSimulating) return;

        const interval = setInterval(() => {
            setMatrix(prevMatrix => {
                const newMatrix = prevMatrix.map(row => [...row]);
                
                // Randomly activate 1-3 cells to simulate footsteps
                const activations = Math.floor(Math.random() * 3) + 1;
                let totalPressure = 0;
                
                for (let i = 0; i < activations; i++) {
                    const row = Math.floor(Math.random() * 8);
                    const col = Math.floor(Math.random() * 8);
                    
                    // Create different intensity levels (0-100)
                    const intensity = Math.floor(Math.random() * 100) + 1;
                    newMatrix[row][col] = intensity;
                    totalPressure += intensity;
                }
                
                // Gradually fade existing activations
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        if (newMatrix[row][col] > 0) {
                            newMatrix[row][col] = Math.max(0, newMatrix[row][col] - 15);
                            totalPressure += newMatrix[row][col];
                        }
                    }
                }
                
                // Update live feedback values
                setCurrentPressure(Math.min(100, totalPressure / 5));
                const newVoltage = (totalPressure / 100) * 0.5 + Math.random() * 0.3;
                setCurrentVoltage(newVoltage);
                
                // Update voltage history for mini chart
                setVoltageHistory(prev => [...prev.slice(1), newVoltage]);
                
                // Slowly increase battery level when generating power
                if (totalPressure > 0) {
                    setBatteryLevel(prev => Math.min(100, prev + 0.1));
                } else {
                    setBatteryLevel(prev => Math.max(0, prev - 0.02));
                }
                
                return newMatrix;
            });
        }, 200);

        return () => clearInterval(interval);
    }, [isSimulating]);

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
        setCurrentPressure(0);
        setCurrentVoltage(0);
        setVoltageHistory(Array(20).fill(0));
    };

    return (
        <Box 
            display="flex" 
            gap="30px"
            p="20px"
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
                    <Typography variant="h5" fontWeight="600" color="#059669">
                        8×8 Piezoelectric Matrix
                    </Typography>
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
                >
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
                                    transition: 'all 0.3s ease',
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
                    <Box mt="20px" p="15px" backgroundColor="#f0fdf4" borderRadius="8px" border="1px solid #bbf7d0">
                        <Typography fontSize="14px" color="#065f46" textAlign="center" fontWeight="600">
                            <strong>Status:</strong> {isSimulating ? "Live Simulation" : "Manual Mode"}
                        </Typography>
                        <Typography fontSize="14px" color="#065f46" textAlign="center" mt="5px">
                            <strong>Active Sensors:</strong> {matrix.flat().filter(cell => cell > 0).length}/64
                        </Typography>
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
            >
                <Typography variant="h5" fontWeight="600" color="#059669" mb="10px">
                    Live Feedback Dashboard
                </Typography>

                {/* Pressure Gauge */}
                <Box p="25px" backgroundColor="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Typography variant="h6" fontWeight="600" color="#374151" mb="20px">
                        Pressure Gauge
                    </Typography>
                    <Box mb="15px">
                        <LinearProgress 
                            variant="determinate" 
                            value={currentPressure} 
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
                        {currentPressure.toFixed(1)}%
                    </Typography>
                    <Typography fontSize="14px" color="#6b7280">
                        Current pressure intensity
                    </Typography>
                </Box>

                {/* Voltage Creation */}
                <Box p="25px" backgroundColor="#f0fdf4" borderRadius="12px" border="1px solid #bbf7d0">
                    <Typography variant="h6" fontWeight="600" color="#065f46" mb="20px">
                        Voltage Generation
                    </Typography>
                    <Typography fontSize="36px" fontWeight="700" color="#059669" mb="10px">
                        {currentVoltage.toFixed(2)}V
                    </Typography>
                    <Typography fontSize="14px" color="#047857" mb="20px">
                        Real-time voltage output
                    </Typography>
                    
                    {/* Mini voltage chart */}
                    <Box display="flex" alignItems="end" gap="3px" height="50px" width="900px">
                        {voltageHistory.map((voltage, index) => (
                            <Box
                                key={index}
                                width="700px"
                                backgroundColor="#10b981"
                                borderRadius="2px"
                                height={`${Math.max(3, (voltage / 1) * 50)}px`}
                                sx={{ opacity: 0.3 + (index / voltageHistory.length) * 0.7 }}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Battery Level */}
                <Box p="25px" backgroundColor="#fefce8" borderRadius="12px" border="#858585">
                    <Typography variant="h6" fontWeight="600" color="#713f12" mb="20px">
                        Battery Level
                    </Typography>
                    <Box mb="15px">
                        <LinearProgress 
                            variant="determinate" 
                            value={batteryLevel} 
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
                    <Typography fontSize="28px" fontWeight="700" color="#713f12" mb="5px">
                        {batteryLevel.toFixed(1)}%
                    </Typography>
                    <Typography fontSize="14px" color="#a16207">
                        Energy storage capacity
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Matrix;