import { Box, Button, Typography, useTheme, FormControl, Select, MenuItem } from "@mui/material";
import { useState } from "react";
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

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [timePeriod, setTimePeriod] = useState('day');

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

    const weeklyData = [
        { day: 'Mon', value: 175, color: '#10b981' },
        { day: 'Tue', value: 195, color: '#10b981' },
        { day: 'Wed', value: 170, color: '#3b82f6' },
        { day: 'Thu', value: 220, color: '#10b981' },
        { day: 'Fri', value: 190, color: '#10b981' },
        { day: 'Sat', value: 205, color: '#3b82f6' },
        { day: 'Sun', value: 160, color: '#8b5cf6' }
    ];

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
            {/* Header */}
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

            {/* DataBars */}
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
                <GlowBox><DataBars title="Voltage Stored" value="2.4" unit="V" icon="battery" /></GlowBox>
                <GlowBox><DataBars title="Power Output" value="3.5" unit="W" icon="power" /></GlowBox>
                <GlowBox><DataBars title="Activation Count" value="845" unit="" icon="lightbulb" /></GlowBox>
                <GlowBox><DataBars title="Energy Level" value="78" unit="%" icon="energy" /></GlowBox>
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
                {/* Real-time Voltage Chart */}
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
                        <LineChart isDashboard={true} timePeriod={timePeriod} timeAxisLabel={getTimeAxisLabel()} />
                    </Box>

                    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px" mt="20px" height="100px">
                        <Box 
                            textAlign="center" 
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Typography variant="h4" color={colors.grey[600]} fontWeight="600">Peak Energy</Typography>
                            <Typography variant="h4" color={colors.greenAccent[400]} fontWeight="600">95 mWh</Typography>
                        </Box>
                        <Box 
                            textAlign="center"
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Typography variant="h6" color={colors.grey[400]}>Average</Typography>
                            <Typography variant="h6" color={colors.greenAccent[400]} fontWeight="600">48 mWh</Typography>
                        </Box>
                        <Box 
                            textAlign="center"
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Typography variant="body2" color={colors.grey[300]}>Total</Typography>
                            <Typography variant="h6" color={colors.greenAccent[400]} fontWeight="600">578 mWh</Typography>
                        </Box>
                    </Box>
                </GlowBox>

                {/* System Health - Widened */}
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
                            { label: "Arduino Controller", status: "Online", isOnline: true },
                            { label: "Piezoelectric Array", status: "Active", isOnline: true },
                            { label: "LED Display", status: "Active", isOnline: true },
                            { label: "Light Level", status: "420 lux", isOnline: false },
                            { label: "Temperature", status: "26.8°C", isOnline: false },
                            { label: "Humidity", status: "65%", isOnline: false }
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
                                        backgroundColor={item.isOnline ? "#10b981" : "#3b82f6"}
                                        sx={{
                                            boxShadow: item.isOnline 
                                                ? "0 0 8px rgba(16, 185, 129, 0.6)" 
                                                : "0 0 8px rgba(59, 130, 246, 0.6)"
                                        }}
                                    />
                                    <Typography fontSize="15px" fontWeight="500" color="#374151">
                                        {item.label}
                                    </Typography>
                                </Box>
                                <Typography fontSize="15px" fontWeight="600" color={item.isOnline ? "#10b981" : "#3b82f6"}>
                                    {item.status}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box 
                        p="16px" 
                        backgroundColor="#f0fdf4" 
                        borderRadius="8px" 
                        border="1px solid #bbf7d0"
                        component={motion.div}
                        whileHover={{ 
                            boxShadow: "0 4px 15px rgba(16, 185, 129, 0.2)",
                            backgroundColor: "#ecfdf5"
                        }}
                    >
                        <Typography fontSize="18px" fontWeight="600" color="#065f46" mb="10px">System Status</Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography fontSize="14px" color="#047857">All systems operational</Typography>
                            <Box 
                                backgroundColor="#10b981" 
                                color="white" 
                                px="14px" 
                                py="6px" 
                                borderRadius="12px" 
                                fontSize="13px" 
                                fontWeight="600"
                                sx={{ boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)" }}
                            >
                                HEALTHY
                            </Box>
                        </Box>
                    </Box>
                </GlowBox>

                {/* Recent Activities - Widened & Enlarged */}
                <GlowBox
                    backgroundColor="white"
                    borderRadius="12px"
                    p="20px"
                    border="1px solid #e5e7eb"
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                    height="590px"
                    minWidth="400px"
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

                    <Box display="flex" flexDirection="column" gap="28px">
                        {[
                            { title: "Piezoelectric array calibrated", subtitle: "Sensitivity optimized for foot traffic", time: "2m", color: "#10b981", badge: "SYSTEM", icon: BuildIcon },
                            { title: "Energy threshold reached", subtitle: "2.5V storage capacity achieved", time: "8m", color: "#059669", badge: "ENERGY", icon: BatteryChargingFullIcon },
                            { title: "LED display activated", subtitle: "Step counter updated: 845 steps", time: "12m", color: "#3b82f6", badge: "OUTPUT", icon: WbSunnyIcon },
                            { title: "Voltage spike detected", subtitle: "Peak 3.2V from heavy footstep", time: "25m", color: "#f59e0b", badge: "ALERT", icon: TrendingUpIcon },
                            { title: "Daily energy report", subtitle: "578 mWh generated today", time: "1h", color: "#8b5cf6", badge: "REPORT", icon: AssessmentIcon }
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
                        <PieChart />
                    </Box>
                </GlowBox>
            </Box>
        </Box>
    );
};

export default Dashboard;