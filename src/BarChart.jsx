import { ResponsiveBar } from '@nivo/bar';

// Updated sample data for weekly accumulated voltage per day
const weeklyData = [
    { day: 'Monday', voltage: 120, color: '#10b981' },
    { day: 'Tuesday', voltage: 135, color: '#10b981' },
    { day: 'Wednesday', voltage: 150, color: '#3b82f6' },
    { day: 'Thursday', voltage: 110, color: '#10b981' },
    { day: 'Friday', voltage: 160, color: '#10b981' },
    { day: 'Saturday', voltage: 130, color: '#3b82f6' },
    { day: 'Sunday', voltage: 140, color: '#8b5cf6' },
];

const WeeklyPerformanceChart = () => (
    <ResponsiveBar
        data={weeklyData}
        keys={['voltage']}
        indexBy="day"
        margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
        padding={0.4}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={({ data }) => data.color}
        borderRadius={6}
        borderWidth={0}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Day of Week',
            legendPosition: 'middle',
            legendOffset: 45,
            tickTextColor: '#6b7280',
            legendTextColor: '#6b7280',
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Voltage (V)',
            legendPosition: 'middle',
            legendOffset: -45,
            tickTextColor: '#6b7280',
            legendTextColor: '#6b7280',
        }}
        enableGridY={true}
        gridYValues={[50, 100, 150, 200]}
        theme={{
            grid: {
                line: {
                    stroke: '#e5e7eb',
                    strokeWidth: 1,
                    strokeDasharray: '2,2',
                },
            },
            axis: {
                ticks: {
                    text: {
                        fontSize: 11,
                        fontWeight: '500',
                    },
                },
                legend: {
                    text: {
                        fontSize: 12,
                        fontWeight: '600',
                    },
                },
            },
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#374151"
        animate={true}
        motionConfig="gentle"
        tooltip={({ value, data }) => (
            <div
                style={{
                    background: 'white',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    fontWeight: '500',
                    fontSize: '14px',
                    color: '#374151',
                }}
            >
                <strong>{data.day}</strong>: {value} V
            </div>
        )}
    />
);

export default WeeklyPerformanceChart;
