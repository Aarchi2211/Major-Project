import { useState } from 'react';
import './Admin.css';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('users');

  // Users Management
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinDate: '2023-06-15', lastLogin: '2024-01-22' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joinDate: '2023-08-20', lastLogin: '2024-01-21' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Active', joinDate: '2023-09-10', lastLogin: '2024-01-20' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'User', status: 'Inactive', joinDate: '2023-07-05', lastLogin: '2024-01-15' },
    { id: 5, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'Active', joinDate: '2023-10-12', lastLogin: '2024-01-22' },
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'User' });

  // Cost Thresholds
  const [thresholds, setThresholds] = useState({
    dailyLimit: 500,
    monthlyLimit: 15000,
    warningPercentage: 80,
    alertEmail: true,
    alertSlack: false,
  });

  const [editThreshold, setEditThreshold] = useState(false);
  const [tempThresholds, setTempThresholds] = useState(thresholds);

  // System Reports Data
  const systemReportData = [
    { month: 'January', totalCost: 12450, activeUsers: 45, resources: 156 },
    { month: 'December', totalCost: 11200, activeUsers: 42, resources: 142 },
    { month: 'November', totalCost: 10850, activeUsers: 40, resources: 138 },
    { month: 'October', totalCost: 11500, activeUsers: 43, resources: 150 },
    { month: 'September', totalCost: 10200, activeUsers: 38, resources: 130 },
    { month: 'August', totalCost: 9800, activeUsers: 35, resources: 125 },
  ];

  const costDistribution = [
    { name: 'Compute', value: 6200 },
    { name: 'Storage', value: 3850 },
    { name: 'Network', value: 2400 },
  ];

  const COLORS = ['#667eea', '#764ba2', '#f39c12'];

  // Handlers
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      alert('Please fill in all fields');
      return;
    }
    setUsers([...users, { ...newUser, id: users.length + 1, status: 'Active', joinDate: new Date().toISOString().split('T')[0], lastLogin: new Date().toISOString().split('T')[0] }]);
    setNewUser({ name: '', email: '', role: 'User' });
    setShowAddUser(false);
    alert('User added successfully!');
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
      alert('User deleted successfully!');
    }
  };

  const handleToggleUserStatus = (id) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
    ));
  };

  const handleSaveThresholds = () => {
    setThresholds(tempThresholds);
    setEditThreshold(false);
    alert('Thresholds updated successfully!');
  };

  const handleThresholdChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempThresholds({
      ...tempThresholds,
      [name]: type === 'checkbox' ? checked : parseFloat(value)
    });
  };

  const activeUserCount = users.filter(u => u.status === 'Active').length;
  const inactiveUserCount = users.filter(u => u.status === 'Inactive').length;
  const adminCount = users.filter(u => u.role === 'Admin').length;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, set cost thresholds, and view system-wide reports</p>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Manage Users
        </button>
        <button
          className={`nav-btn ${activeTab === 'thresholds' ? 'active' : ''}`}
          onClick={() => setActiveTab('thresholds')}
        >
          ⚙️ Cost Thresholds
        </button>
        <button
          className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📊 System Reports
        </button>
      </nav>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <section className="admin-section">
          <div className="section-header">
            <h2>Manage Users</h2>
            <button className="btn-primary" onClick={() => setShowAddUser(!showAddUser)}>
              + Add New User
            </button>
          </div>

          {/* User Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{users.length}</span>
            </div>
            <div className="stat-card active">
              <span className="stat-label">Active Users</span>
              <span className="stat-value">{activeUserCount}</span>
            </div>
            <div className="stat-card inactive">
              <span className="stat-label">Inactive Users</span>
              <span className="stat-value">{inactiveUserCount}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Administrators</span>
              <span className="stat-value">{adminCount}</span>
            </div>
          </div>

          {/* Add User Form */}
          {showAddUser && (
            <div className="add-user-form">
              <h3>Add New User</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter user's full name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter user's email"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="form-actions">
                <button className="btn-save" onClick={handleAddUser}>
                  Add User
                </button>
                <button className="btn-cancel" onClick={() => setShowAddUser(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className={`status-${user.status.toLowerCase()}`}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.joinDate}</td>
                    <td>{user.lastLogin}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-toggle"
                        onClick={() => handleToggleUserStatus(user.id)}
                        title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'Active' ? '⊙' : '○'}
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Thresholds Tab */}
      {activeTab === 'thresholds' && (
        <section className="admin-section">
          <div className="section-header">
            <h2>Cost Thresholds & Alerts</h2>
            {!editThreshold && (
              <button className="btn-primary" onClick={() => setEditThreshold(true)}>
                ✎ Edit Thresholds
              </button>
            )}
          </div>

          {editThreshold ? (
            <div className="threshold-form">
              <div className="form-group">
                <label>Daily Cost Limit ($)</label>
                <input
                  type="number"
                  name="dailyLimit"
                  value={tempThresholds.dailyLimit}
                  onChange={handleThresholdChange}
                />
              </div>

              <div className="form-group">
                <label>Monthly Cost Limit ($)</label>
                <input
                  type="number"
                  name="monthlyLimit"
                  value={tempThresholds.monthlyLimit}
                  onChange={handleThresholdChange}
                />
              </div>

              <div className="form-group">
                <label>Warning Alert Percentage (%)</label>
                <input
                  type="number"
                  name="warningPercentage"
                  min="0"
                  max="100"
                  value={tempThresholds.warningPercentage}
                  onChange={handleThresholdChange}
                />
                <small>Alert users when they reach this percentage of their limit</small>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="alertEmail"
                    checked={tempThresholds.alertEmail}
                    onChange={handleThresholdChange}
                  />
                  <span>Send Email Alerts</span>
                </label>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="alertSlack"
                    checked={tempThresholds.alertSlack}
                    onChange={handleThresholdChange}
                  />
                  <span>Send Slack Alerts</span>
                </label>
              </div>

              <div className="form-actions">
                <button className="btn-save" onClick={handleSaveThresholds}>
                  Save Thresholds
                </button>
                <button className="btn-cancel" onClick={() => {
                  setEditThreshold(false);
                  setTempThresholds(thresholds);
                }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="threshold-display">
              <div className="threshold-item">
                <span className="label">Daily Cost Limit</span>
                <span className="value">${thresholds.dailyLimit}</span>
              </div>
              <div className="threshold-item">
                <span className="label">Monthly Cost Limit</span>
                <span className="value">${thresholds.monthlyLimit}</span>
              </div>
              <div className="threshold-item">
                <span className="label">Warning Alert at</span>
                <span className="value">{thresholds.warningPercentage}%</span>
              </div>
              <div className="threshold-item">
                <span className="label">Email Alerts</span>
                <span className="value">{thresholds.alertEmail ? '✓ Enabled' : '✗ Disabled'}</span>
              </div>
              <div className="threshold-item">
                <span className="label">Slack Alerts</span>
                <span className="value">{thresholds.alertSlack ? '✓ Enabled' : '✗ Disabled'}</span>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <section className="admin-section">
          <h2>System-Wide Reports</h2>

          {/* Reports Charts */}
          <div className="reports-grid">
            <div className="report-card">
              <h3>Monthly Cost Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={systemReportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalCost"
                    stroke="#667eea"
                    strokeWidth={2}
                    dot={{ fill: '#667eea', r: 5 }}
                    name="Total Cost"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="report-card">
              <h3>Active Users & Resources</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={systemReportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="activeUsers" fill="#667eea" name="Active Users" />
                  <Bar dataKey="resources" fill="#764ba2" name="Resources" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="report-card">
              <h3>Cost Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name}: $${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Report */}
          <div className="report-summary">
            <h3>System Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Current Monthly Cost</span>
                <span className="summary-value">${systemReportData[0].totalCost}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Active Users</span>
                <span className="summary-value">{activeUserCount}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Resources</span>
                <span className="summary-value">{systemReportData[0].resources}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Month-over-Month Change</span>
                <span className="summary-value positive">
                  +{((systemReportData[0].totalCost - systemReportData[1].totalCost) / systemReportData[1].totalCost * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}