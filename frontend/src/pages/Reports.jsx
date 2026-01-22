import { useState } from 'react';
import './Reports.css';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState('current');

  // Daily cost data
  const dailyData = [
    { date: 'Jan 15', cost: 420, compute: 250, storage: 120, network: 50 },
    { date: 'Jan 16', cost: 385, compute: 220, storage: 115, network: 50 },
    { date: 'Jan 17', cost: 520, compute: 320, storage: 130, network: 70 },
    { date: 'Jan 18', cost: 450, compute: 280, storage: 125, network: 45 },
    { date: 'Jan 19', cost: 380, compute: 210, storage: 120, network: 50 },
    { date: 'Jan 20', cost: 510, compute: 310, storage: 140, network: 60 },
    { date: 'Jan 21', cost: 475, compute: 290, storage: 125, network: 60 },
    { date: 'Jan 22', cost: 490, compute: 300, storage: 130, network: 60 },
  ];

  // Monthly cost data
  const monthlyData = [
    { month: 'January', cost: 12450, compute: 6200, storage: 3850, network: 2400 },
    { month: 'December', cost: 11200, compute: 5800, storage: 3400, network: 2000 },
    { month: 'November', cost: 10850, compute: 5400, storage: 3250, network: 2200 },
    { month: 'October', cost: 11500, compute: 5900, storage: 3600, network: 2000 },
    { month: 'September', cost: 10200, compute: 5100, storage: 3000, network: 2100 },
    { month: 'August', cost: 9800, compute: 4800, storage: 2900, network: 2100 },
  ];

  // Cost by service
  const serviceData = [
    { name: 'Compute (EC2, Lambda)', value: 6200, percentage: 49.8 },
    { name: 'Storage (S3, EBS)', value: 3850, percentage: 30.9 },
    { name: 'Networking', value: 2400, percentage: 19.3 },
  ];

  // Cost trend
  const costTrendData = [
    { name: 'Budget', value: 15000 },
    { name: 'Actual Cost', value: 12450 },
  ];

  const COLORS = ['#667eea', '#764ba2', '#f39c12', '#e74c3c', '#26a65b', '#3498db'];

  const handleDownloadPDF = () => {
    console.log('Downloading PDF report...');
    alert('PDF download functionality would be implemented with a backend service');
  };

  const handleDownloadCSV = () => {
    // Create CSV content
    const csvContent = [
      ['Cloud Cost Report'],
      ['Report Type', reportType === 'daily' ? 'Daily' : 'Monthly'],
      ['Generated Date', new Date().toLocaleDateString()],
      [],
      ['Date/Month', 'Cost', 'Compute', 'Storage', 'Network'],
      ...(reportType === 'daily' ? dailyData : monthlyData).map(item => [
        item.date || item.month,
        item.cost,
        item.compute,
        item.storage,
        item.network,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cost-report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const currentData = reportType === 'daily' ? dailyData : monthlyData;
  const totalCost = currentData.reduce((sum, item) => sum + item.cost, 0);
  const avgCost = Math.round(totalCost / currentData.length);

  return (
    <div className="reports-container">
      <header className="reports-header">
        <h1>Cost Reports & Analysis</h1>
        <p>Generate and download detailed cost reports for your cloud infrastructure</p>
      </header>

      {/* Controls */}
      <section className="report-controls">
        <div className="control-group">
          <label>Report Type:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="daily"
                checked={reportType === 'daily'}
                onChange={(e) => setReportType(e.target.value)}
              />
              <span>Daily Report</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="monthly"
                checked={reportType === 'monthly'}
                onChange={(e) => setReportType(e.target.value)}
              />
              <span>Monthly Report</span>
            </label>
          </div>
        </div>

        <div className="download-buttons">
          <button className="btn-download pdf" onClick={handleDownloadPDF}>
            📥 Download PDF
          </button>
          <button className="btn-download csv" onClick={handleDownloadCSV}>
            📥 Download CSV
          </button>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="report-stats">
        <div className="stat-box">
          <span className="stat-label">Total Cost</span>
          <span className="stat-value">${totalCost.toFixed(2)}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Average {reportType === 'daily' ? 'Daily' : 'Monthly'} Cost</span>
          <span className="stat-value">${avgCost}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Highest Cost</span>
          <span className="stat-value">${Math.max(...currentData.map(d => d.cost))}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Lowest Cost</span>
          <span className="stat-value">${Math.min(...currentData.map(d => d.cost))}</span>
        </div>
      </section>

      {/* Charts */}
      <section className="charts-grid">
        {/* Line Chart */}
        <div className="chart-card">
          <h2>Cost Trend ({reportType === 'daily' ? 'Daily' : 'Monthly'})</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={reportType === 'daily' ? 'date' : 'month'} />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#667eea"
                strokeWidth={2}
                dot={{ fill: '#667eea', r: 5 }}
                activeDot={{ r: 7 }}
                name="Total Cost"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stacked Bar Chart */}
        <div className="chart-card">
          <h2>Cost Breakdown by Service</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={reportType === 'daily' ? 'date' : 'month'} />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar dataKey="compute" stackId="a" fill="#667eea" name="Compute" />
              <Bar dataKey="storage" stackId="a" fill="#764ba2" name="Storage" />
              <Bar dataKey="network" stackId="a" fill="#f39c12" name="Network" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Current Month */}
        <div className="chart-card">
          <h2>Current {reportType === 'daily' ? 'Day' : 'Month'} Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Budget vs Actual */}
        <div className="chart-card">
          <h2>Budget vs Actual Cost</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Bar dataKey="value" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Detailed Table */}
      <section className="detailed-report">
        <h2>Detailed Report</h2>
        <div className="table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>{reportType === 'daily' ? 'Date' : 'Month'}</th>
                <th>Total Cost</th>
                <th>Compute</th>
                <th>Storage</th>
                <th>Network</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => {
                const trend = index > 0 ? item.cost - currentData[index - 1].cost : 0;
                const trendPercent = index > 0 ? ((trend / currentData[index - 1].cost) * 100).toFixed(1) : 0;
                return (
                  <tr key={index}>
                    <td>{item.date || item.month}</td>
                    <td className="cost-cell">${item.cost}</td>
                    <td>${item.compute}</td>
                    <td>${item.storage}</td>
                    <td>${item.network}</td>
                    <td>
                      <span className={`trend ${trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral'}`}>
                        {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trendPercent)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}