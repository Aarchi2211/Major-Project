import { useState } from 'react';
import './Dashboard.css';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', cost: 2400 },
    { month: 'Feb', cost: 1398 },
    { month: 'Mar', cost: 9800 },
    { month: 'Apr', cost: 3908 },
    { month: 'May', cost: 4800 },
    { month: 'Jun', cost: 3800 },
    { month: 'Jul', cost: 4300 },
    { month: 'Aug', cost: 5200 },
    { month: 'Sep', cost: 4100 },
    { month: 'Oct', cost: 6800 },
    { month: 'Nov', cost: 5900 },
    { month: 'Dec', cost: 7200 },
  ];

  const recentAlerts = [
    { id: 1, title: 'High CPU Usage', severity: 'warning', time: '2 hours ago', resource: 'EC2-Instance-01' },
    { id: 2, title: 'Storage Limit Warning', severity: 'warning', time: '4 hours ago', resource: 'S3-Bucket' },
    { id: 3, title: 'Unused Database Instance', severity: 'info', time: '1 day ago', resource: 'RDS-DB' },
    { id: 4, title: 'Unattached Volume Detected', severity: 'info', time: '2 days ago', resource: 'EBS-Vol' },
    { id: 5, title: 'Cost Anomaly Detected', severity: 'critical', time: '3 days ago', resource: 'Lambda-Func' },
  ];

  const summaryCards = [
    {
      title: 'Total Cloud Cost',
      value: '$12,450',
      change: '+5.2%',
      icon: '💰',
      color: 'blue'
    },
    {
      title: 'Active Resources',
      value: '156',
      change: '+2',
      icon: '⚙️',
      color: 'green'
    },
    {
      title: 'Cost Leaks Detected',
      value: '8',
      change: '+3 this month',
      icon: '⚠️',
      color: 'red'
    }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Cloud Cost Dashboard</h1>
        <p>Monitor your cloud infrastructure and costs in real-time</p>
      </header>

      {/* Summary Cards */}
      <section className="summary-section">
        <div className="cards-grid">
          {summaryCards.map((card) => (
            <div key={card.title} className={`summary-card ${card.color}`}>
              <div className="card-icon">{card.icon}</div>
              <div className="card-content">
                <h3>{card.title}</h3>
                <p className="card-value">{card.value}</p>
                <span className="card-change">{card.change}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="chart-container">
          <h2>Monthly Cloud Cost Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `$${value}`}
                contentStyle={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#667eea" 
                strokeWidth={2}
                dot={{ fill: '#667eea', r: 5 }}
                activeDot={{ r: 7 }}
                name="Monthly Cost"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Resource Usage by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { resource: 'Compute', cost: 4500 },
              { resource: 'Storage', cost: 2300 },
              { resource: 'Database', cost: 3100 },
              { resource: 'Networking', cost: 1200 },
              { resource: 'Other', cost: 1350 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="resource" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `$${value}`}
                contentStyle={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
              />
              <Legend />
              <Bar 
                dataKey="cost" 
                fill="#764ba2"
                name="Cost ($)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Recent Alerts */}
      <section className="alerts-section">
        <h2>Recent Alerts</h2>
        <div className="alerts-container">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className={`alert-item ${alert.severity}`}>
              <div className="alert-indicator"></div>
              <div className="alert-content">
                <div className="alert-header">
                  <h4>{alert.title}</h4>
                  <span className="alert-time">{alert.time}</span>
                </div>
                <p className="alert-resource">{alert.resource}</p>
              </div>
              <div className="alert-action">
                <button className="btn-small">View</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}