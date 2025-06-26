import { ResponsivePie } from '@nivo/pie'
import { useTheme } from '@mui/material';
import { tokens } from './theme';

// Sample pie data with proper format
const samplePieData = [
  {
    "id": "morning_peak",
    "label": "Morning Peak (7-9 AM)",
    "value": 30,
    "color": "#059669"
  },
  {
    "id": "lunch_period", 
    "label": "Lunch Period (12-2 PM)",
    "value": 25,
    "color": "#10b981"
  },
  {
    "id": "afternoon",
    "label": "Afternoon (3-5 PM)", 
    "value": 35,
    "color": "#34d399"
  },
  {
    "id": "evening_night",
    "label": "Evening/Night",
    "value": 10,
    "color": "#6ee7b7"
  }
];

const PieChart = ({ data = samplePieData }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Debug: Check if data exists
    console.log('PieChart data:', data);

    if (!data || data.length === 0) {
        return (
            <div style={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: colors.grey[900] 
            }}>
                No data available
            </div>
        );
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ResponsivePie
                data={data}
                theme={{
                    axis: {
                        domain: {
                            line: {
                                stroke: colors.grey[100],
                            },
                        },
                        legend: {
                            text: {
                                fill: colors.grey[100],
                            },
                        },
                        ticks: {
                            line: {
                                stroke: colors.grey[100],
                                strokeWidth: 1,
                            },
                            text: {
                                fill: colors.grey[100],
                            },
                        },
                    },
                    legends: {
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                    tooltip: {
                        container: {
                            background: colors.primary[400],
                            color: colors.grey[100],
                        },
                    },
                }}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ datum: 'data.color' }} // Use colors from data
                borderWidth={1}
                borderColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor={colors.grey[100]}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                enableArcLabels={true}
                arcLabelsRadiusOffset={0.4}
                arcLabelsSkipAngle={7}
                arcLabelsTextColor={colors.grey[100]}
                legends={[
                    {
                        anchor: "bottom",
                        direction: "row",
                        justify: false,
                        translateX: 0,
                        translateY: 65,
                        itemsSpacing: 25,
                        itemWidth: 140,
                        itemHeight: 24,
                        itemTextColor: colors.grey[900] || '#1f2937',
                        itemDirection: "left-to-right",
                        itemOpacity: 1,
                        symbolSize: 20,
                        symbolShape: "circle",
                        effects: [
                            {
                                on: "hover",
                                style: {
                                    itemTextColor: colors.primary[900] || '#047857',
                                },
                            },
                        ],
                    },
                ]}
            />
        </div>
    );
};

export default PieChart;