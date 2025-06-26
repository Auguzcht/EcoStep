import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@mui/material';
import { tokens } from './theme';
import { voltageData, dailyVoltageAverages, weeklyVoltageData } from './SampleLineData';

const LineChart = ({ 
    isDashboard = false, 
    timePeriod = 'day', 
    timeAxisLabel = 'Time (Days)',
    data = null // Accept data from ThingSpeak API
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Function to get the appropriate data based on time period
    const getData = () => {
        // If we have API data, use it
        if (data) return data;
        
        // Otherwise fall back to sample data
        switch(timePeriod) {
            case 'hour': return voltageData; // Your detailed hourly data by day
            case 'day': return dailyVoltageAverages; // Your daily averages
            case 'week': return weeklyVoltageData; // Your weekly data
            default: return dailyVoltageAverages;
        }
    };

    // Function to get appropriate Y-axis scale based on time period
    const getYScale = () => {
        switch(timePeriod) {
            case 'hour': 
                return {
                    type: "linear",
                    min: 0,
                    max: 3.5,
                    stacked: false,
                    reverse: false,
                };
            case 'day':
                return {
                    type: "linear",
                    min: 0,
                    max: 3.5,
                    stacked: false,
                    reverse: false,
                };
            case 'week':
                return {
                    type: "linear",
                    min: 0,
                    max: 3.5,
                    stacked: false,
                    reverse: false,
                };
            default:
                return {
                    type: "linear",
                    min: 0,
                    max: 3.5,
                    stacked: false,
                    reverse: false,
                };
        }
    };

    return (
        <ResponsiveLine
            data={getData()}
            theme={{
                axis: {
                    domain: {
                        line: {
                            stroke: colors.grey[500],
                        },
                    },
                    legend: {
                        text: {
                            fill: colors.grey[500],
                        },
                    },
                    ticks: {
                        line: {
                            stroke: colors.grey[500],
                            strokeWidth: 1,
                        },
                        text: {
                            fill: colors.grey[500],
                        },
                    },
                },
                legends: {
                    text: {
                        fill: colors.grey[500],
                    },
                },
                tooltip: {
                    container: {
                        color: colors.primary[500],
                        background: colors.primary[400],
                        fontSize: 12,
                    },
                },
                grid: {
                    line: {
                        stroke: colors.grey[800],
                        strokeWidth: 1,
                    },
                },
            }}
            colors={{ scheme: "set2" }}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={getYScale()}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: "bottom",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: timePeriod === 'week' ? -45 : 0, // Rotate week labels if needed
                legend: isDashboard ? undefined : timeAxisLabel,
                legendOffset: 36,
                legendPosition: "middle",
            }}
            axisLeft={{
                orient: "left",
                tickValues: 6,
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? undefined : "Voltage (V)",
                legendOffset: -40,
                legendPosition: "middle",
            }}
            enableGridX={isDashboard ? false : true}
            enableGridY={isDashboard ? false : true}
            pointSize={isDashboard ? 4 : 8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            enableTouchCrosshair={true}
            legends={
                isDashboard
                    ? [] // No legends in dashboard mode to save space
                    : [
                          {
                              anchor: "bottom-right",
                              direction: "column",
                              justify: false,
                              translateX: 100,
                              translateY: 0,
                              itemsSpacing: 0,
                              itemDirection: "left-to-right",
                              itemWidth: 80,
                              itemHeight: 20,
                              itemOpacity: 0.75,
                              symbolSize: 12,
                              symbolShape: "circle",
                              symbolBorderColor: "rgba(0, 0, 0, .5)",
                              effects: [
                                  {
                                      on: "hover",
                                      style: {
                                          itemBackground: "rgba(0, 0, 0, .03)",
                                          itemOpacity: 1,
                                      },
                                  },
                              ],
                          },
                      ]
            }
            animate={true}
            motionConfig="gentle"
        />
    );
};

export default LineChart;