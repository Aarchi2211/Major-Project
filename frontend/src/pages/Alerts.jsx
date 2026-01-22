import { useState } from 'react';
import './Alerts.css';

export default function Alerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'cost-leak',
      title: 'High CPU Usage Detected',
      message: 'EC2-Instance-01 is consuming excessive CPU resources',
      severity: 'critical',
      resource: 'EC2-Instance-01',
      dateTime: '2024-01-22T14:30:00',
      suggestedAction: 'Optimize instance type or reduce workload. Consider using auto-scaling.',
      status: 'unread',
      category: 'Performance'
    },
    {
      id: 2,
      type: 'cost-leak',
      title: 'Idle Storage Bucket Detected',
      message: 'S3-Archive bucket has not been accessed in 90 days',
      severity: 'high',
      resource: 'S3-Archive',
      dateTime: '2024-01-22T12:15:00',
      suggestedAction: 'Archive to Glacier storage or delete unused data to reduce storage costs.',
      status: 'unread',
      category: 'Cost Optimization'
    },
    {
      id: 3,
      type: 'cost-leak',
      title: 'Unattached EBS Volume',
      message: 'EBS-Volume-Old is not attached to any EC2 instance',
      severity: 'high',
      resource: 'EBS-Volume-Old',
      dateTime: '2024-01-22T10:45:00',
      suggestedAction: 'Delete the unattached volume or reattach it to an active instance.',
      status: 'read',
      category: 'Resource Management'
    },
    {
      id: 4,
      type: 'cost-leak',
      title: 'NAT Gateway Underutilized',
      message: 'NAT-Gateway-01 is processing minimal traffic',
      severity: 'medium',
      resource: 'NAT-Gateway-01',
      dateTime: '2024-01-22T09:20:00',
      suggestedAction: 'Consider removing NAT gateway or consolidating traffic to reduce network costs.',
      status: 'read',
      category: 'Network Optimization'
    },
    {
      id: 5,
      type: 'cost-leak',
      title: 'Database Connection Pool Unused',
      message: 'RDS-Dev-DB has idle connections consuming memory',
      severity: 'medium',
      resource: 'RDS-Dev-DB',
      dateTime: '2024-01-21T16:30:00',
      suggestedAction: 'Configure connection timeout settings or enable query editor instead of persistent connections.',
      status: 'read',
      category: 'Database Optimization'
    },
    {
      id: 6,
      type: 'cost-leak',
      title: 'Elastic IP Not Associated',
      message: 'Elastic-IP-001 is allocated but not associated with any instance',
      severity: 'low',
      resource: 'Elastic-IP-001',
      dateTime: '2024-01-21T13:10:00',
      suggestedAction: 'Release the elastic IP or associate it with an active instance.',
      status: 'read',
      category: 'Network Management'
    },
    {
      id: 7,
      type: 'cost-leak',
      title: 'CloudFront Distribution Inactive',
      message: 'CDN-Distribution-01 has received zero requests in 7 days',
      severity: 'high',
      resource: 'CDN-Distribution-01',
      dateTime: '2024-01-20T11:00:00',
      suggestedAction: 'Disable or delete the CloudFront distribution to eliminate daily minimum charges.',
      status: 'read',
      category: 'CDN Optimization'
    },
    {
      id: 8,
      type: 'cost-leak',
      title: 'Backup Storage Accumulation',
      message: 'Backup-Storage bucket has grown by 200GB this month',
      severity: 'medium',
      resource: 'Backup-Storage',
      dateTime: '2024-01-19T15:45:00',
      suggestedAction: 'Implement lifecycle policies to archive old backups or implement retention policies.',
      status: 'read',
      category: 'Storage Management'
    },
  ]);

  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = filterSeverity === 'All' || alert.severity === filterSeverity;
    const statusMatch = filterStatus === 'All' || alert.status === filterStatus;
    const searchMatch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       alert.resource.toLowerCase().includes(searchQuery.toLowerCase());
    return severityMatch && statusMatch && searchMatch;
  });

  const unreadCount = alerts.filter(a => a.status === 'unread').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;

  const handleMarkAsRead = (alertId) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId ? { ...alert, status: 'read' } : alert
    ));
  };

  const handleMarkAsUnread = (alertId) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId ? { ...alert, status: 'unread' } : alert
    ));
  };

  const handleDismiss = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    setSelectedAlert(null);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="alerts-container">
      <header className="alerts-header">
        <h1>Alerts & Notifications</h1>
        <p>Track cost leak alerts and optimization recommendations</p>
      </header>

      {/* Stats */}
      <section className="alert-stats">
        <div className="stat-card">
          <span className="stat-label">Unread Alerts</span>
          <span className="stat-value">{unreadCount}</span>
        </div>
        <div className="stat-card critical">
          <span className="stat-label">Critical</span>
          <span className="stat-value">{criticalCount}</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-label">High Severity</span>
          <span className="stat-value">{highCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Alerts</span>
          <span className="stat-value">{alerts.length}</span>
        </div>
      </section>

      {/* Controls */}
      <section className="alert-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search alerts by resource or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
            <option value="All">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </section>

      {/* Alerts List */}
      <section className="alerts-list">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-item ${alert.severity} ${alert.status}`}
              onClick={() => setSelectedAlert(selectedAlert?.id === alert.id ? null : alert)}
            >
              <div className="alert-indicator"></div>

              <div className="alert-main-content">
                <div className="alert-header-row">
                  <h3 className="alert-title">{alert.title}</h3>
                  <span className={`severity-badge ${alert.severity}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>

                <p className="alert-message">{alert.message}</p>

                <div className="alert-meta">
                  <span className="meta-item">
                    <strong>Resource:</strong> {alert.resource}
                  </span>
                  <span className="meta-item">
                    <strong>Category:</strong> {alert.category}
                  </span>
                  <span className="meta-item time">
                    {formatDateTime(alert.dateTime)}
                  </span>
                </div>

                {selectedAlert?.id === alert.id && (
                  <div className="alert-expanded">
                    <div className="action-section">
                      <h4>Suggested Action</h4>
                      <p>{alert.suggestedAction}</p>
                    </div>

                    <div className="alert-actions">
                      {alert.status === 'unread' ? (
                        <button
                          className="btn-action mark-read"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(alert.id);
                          }}
                        >
                          ✓ Mark as Read
                        </button>
                      ) : (
                        <button
                          className="btn-action mark-unread"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsUnread(alert.id);
                          }}
                        >
                          ○ Mark as Unread
                        </button>
                      )}
                      <button
                        className="btn-action dismiss"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismiss(alert.id);
                        }}
                      >
                        ✕ Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {selectedAlert?.id !== alert.id && (
                <button
                  className="btn-expand"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAlert(alert);
                  }}
                >
                  →
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="no-alerts">
            <div className="no-alerts-icon">✓</div>
            <h2>No Alerts Found</h2>
            <p>Great! All your resources are operating optimally.</p>
          </div>
        )}
      </section>
    </div>
  );
}