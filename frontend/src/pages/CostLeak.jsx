import { useState } from 'react';
import './CostLeak.css';

export default function CostLeak() {
  const [leaks, setLeaks] = useState([
    {
      id: 1,
      resourceName: 'EC2-Instance-backup',
      reason: 'Idle VM - No CPU activity for 30 days',
      severity: 'High',
      estimatedCost: '$450.75',
      potentialSavings: '$450.75',
      detectedDate: '2024-01-15',
      lastActive: '2023-12-15',
      region: 'us-east-1',
      action: 'Terminate'
    },
    {
      id: 2,
      resourceName: 'S3-Old-Backup',
      reason: 'Unused storage bucket - No access for 90 days',
      severity: 'Medium',
      estimatedCost: '$125.50',
      potentialSavings: '$125.50',
      detectedDate: '2024-01-18',
      lastActive: '2023-10-20',
      region: 'us-west-2',
      action: 'Archive/Delete'
    },
    {
      id: 3,
      resourceName: 'EBS-Volume-Unattached',
      reason: 'Unattached EBS volume - Not connected to any instance',
      severity: 'High',
      estimatedCost: '$95.20',
      potentialSavings: '$95.20',
      detectedDate: '2024-01-10',
      lastActive: 'N/A',
      region: 'eu-west-1',
      action: 'Delete'
    },
    {
      id: 4,
      resourceName: 'RDS-Dev-Database',
      reason: 'Development database running 24/7 - Unused during off-hours',
      severity: 'Medium',
      estimatedCost: '$320.00',
      potentialSavings: '$160.00',
      detectedDate: '2024-01-12',
      lastActive: '2024-01-20',
      region: 'us-east-1',
      action: 'Schedule Stop'
    },
    {
      id: 5,
      resourceName: 'NAT-Gateway-Unused',
      reason: 'NAT Gateway with minimal traffic',
      severity: 'Low',
      estimatedCost: '$32.00',
      potentialSavings: '$32.00',
      detectedDate: '2024-01-16',
      lastActive: '2024-01-20',
      region: 'ap-south-1',
      action: 'Review'
    },
    {
      id: 6,
      resourceName: 'Elastic-IP-Unassociated',
      reason: 'Elastic IP not associated with any instance',
      severity: 'Low',
      estimatedCost: '$3.65',
      potentialSavings: '$3.65',
      detectedDate: '2024-01-19',
      lastActive: 'N/A',
      region: 'us-west-1',
      action: 'Release'
    },
    {
      id: 7,
      resourceName: 'CloudFront-Distribution',
      reason: 'Inactive CloudFront distribution - Zero requests',
      severity: 'High',
      estimatedCost: '$85.30',
      potentialSavings: '$85.30',
      detectedDate: '2024-01-11',
      lastActive: '2023-11-30',
      region: 'Global',
      action: 'Disable'
    },
    {
      id: 8,
      resourceName: 'Lambda-Old-Version',
      reason: 'Old Lambda function version still incurring costs',
      severity: 'Low',
      estimatedCost: '$5.20',
      potentialSavings: '$5.20',
      detectedDate: '2024-01-17',
      lastActive: '2023-12-01',
      region: 'us-east-1',
      action: 'Delete'
    },
  ]);

  const [filterSeverity, setFilterSeverity] = useState('All');
  const [selectedLeak, setSelectedLeak] = useState(null);

  const filteredLeaks = leaks.filter(leak => 
    filterSeverity === 'All' || leak.severity === filterSeverity
  );

  const totalPotentialSavings = filteredLeaks.reduce((sum, leak) => {
    return sum + parseFloat(leak.potentialSavings.replace('$', ''));
  }, 0);

  const leaksBySeverity = {
    High: leaks.filter(l => l.severity === 'High').length,
    Medium: leaks.filter(l => l.severity === 'Medium').length,
    Low: leaks.filter(l => l.severity === 'Low').length,
  };

  const handleResolve = (leakId) => {
    setLeaks(leaks.filter(leak => leak.id !== leakId));
    setSelectedLeak(null);
  };

  return (
    <div className="costleak-container">
      <header className="costleak-header">
        <h1>Cost Leak Detection</h1>
        <p>Identify and resolve unused resources that are draining your cloud budget</p>
      </header>

      {/* Summary Stats */}
      <section className="summary-stats">
        <div className="stat-item">
          <span className="stat-title">Total Leaks Detected</span>
          <span className="stat-number">{leaks.length}</span>
        </div>
        <div className="stat-item critical">
          <span className="stat-title">High Severity</span>
          <span className="stat-number">{leaksBySeverity.High}</span>
        </div>
        <div className="stat-item warning">
          <span className="stat-title">Medium Severity</span>
          <span className="stat-number">{leaksBySeverity.Medium}</span>
        </div>
        <div className="stat-item info">
          <span className="stat-title">Low Severity</span>
          <span className="stat-number">{leaksBySeverity.Low}</span>
        </div>
        <div className="stat-item savings">
          <span className="stat-title">Potential Monthly Savings</span>
          <span className="stat-number">${totalPotentialSavings.toFixed(2)}</span>
        </div>
      </section>

      {/* Filter */}
      <section className="filter-section">
        <label>Filter by Severity:</label>
        <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
          <option value="All">All Leaks</option>
          <option value="High">High Severity</option>
          <option value="Medium">Medium Severity</option>
          <option value="Low">Low Severity</option>
        </select>
      </section>

      {/* Leaks List */}
      <section className="leaks-section">
        <div className="leaks-grid">
          {filteredLeaks.map((leak) => (
            <div 
              key={leak.id} 
              className={`leak-card ${leak.severity.toLowerCase()}`}
              onClick={() => setSelectedLeak(selectedLeak?.id === leak.id ? null : leak)}
            >
              <div className="leak-header">
                <div className="leak-info">
                  <h3>{leak.resourceName}</h3>
                  <span className={`severity-badge ${leak.severity.toLowerCase()}`}>
                    {leak.severity} Severity
                  </span>
                </div>
                <div className="leak-cost">
                  <span className="cost-label">Monthly Cost</span>
                  <span className="cost-value">{leak.estimatedCost}</span>
                </div>
              </div>

              <div className="leak-reason">
                <span className="reason-label">Reason:</span>
                <p>{leak.reason}</p>
              </div>

              <div className="leak-details">
                <div className="detail-item">
                  <span className="detail-label">Region:</span>
                  <span className="detail-value">{leak.region}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Detected:</span>
                  <span className="detail-value">{leak.detectedDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Active:</span>
                  <span className="detail-value">{leak.lastActive}</span>
                </div>
              </div>

              {selectedLeak?.id === leak.id && (
                <div className="leak-expanded">
                  <div className="expanded-content">
                    <div className="expanded-item">
                      <span>Potential Monthly Savings:</span>
                      <span className="savings-value">{leak.potentialSavings}</span>
                    </div>
                    <div className="expanded-item">
                      <span>Recommended Action:</span>
                      <span className="action-value">{leak.action}</span>
                    </div>
                  </div>
                  <button 
                    className="btn-resolve"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolve(leak.id);
                    }}
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}

              {selectedLeak?.id !== leak.id && (
                <div className="leak-footer">
                  <span className="savings-label">Potential Savings: {leak.potentialSavings}/month</span>
                  <button className="btn-expand">View Details</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredLeaks.length === 0 && (
          <div className="no-leaks">
            <div className="no-leaks-icon">✓</div>
            <h2>No Cost Leaks Detected</h2>
            <p>Great job! Your cloud resources are optimized.</p>
          </div>
        )}
      </section>
    </div>
  );
}