import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Chart.css';

export default function Chart({ 
  data, 
  type = 'line', 
  labels = {},
  title = '',
  height = 300,
  colors = ['#00d4ff', '#ff4757', '#2ed573', '#ffa502']
}) {
  
  // Validate required props
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-error">
          No data available to display chart
        </div>
      </div>
    );
  }

  // Extract label keys from data
  const dataKeys = labels.dataKeys || Object.keys(data[0]).filter(key => key !== (labels.xAxis || 'name'));
  const xAxisKey = labels.xAxis || 'name';

  // Render Line Chart
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey={xAxisKey}
          stroke="#999"
          label={{ value: labels.xAxisLabel || '', position: 'insideBottomRight', offset: -5 }}
        />
        <YAxis 
          stroke="#999"
          label={{ value: labels.yAxisLabel || '', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #00d4ff', borderRadius: '4px' }}
          labelStyle={{ color: '#00d4ff' }}
        />
        <Legend />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            dot={{ fill: colors[index % colors.length], r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  // Render Bar Chart
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey={xAxisKey}
          stroke="#999"
          label={{ value: labels.xAxisLabel || '', position: 'insideBottomRight', offset: -5 }}
        />
        <YAxis 
          stroke="#999"
          label={{ value: labels.yAxisLabel || '', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #00d4ff', borderRadius: '4px' }}
          labelStyle={{ color: '#00d4ff' }}
        />
        <Legend />
        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
            radius={[8, 8, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="chart-wrapper">
        {type === 'line' ? renderLineChart() : renderBarChart()}
      </div>
    </div>
  );
}
