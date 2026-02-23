import { useState } from 'react';
import './CloudUsage.css';

export default function CloudUsage() {
  const [resources, setResources] = useState([
    {
      id: 1,
      name: 'EC2-Instance-01',
      type: 'Compute',
      cpu: 65,
      storage: 250,
      bandwidth: 1250,
      cost: '$450.50',
      status: 'Active',
      region: 'us-east-1'
    },
    {
      id: 2,
      name: 'RDS-Database',
      type: 'Database',
      cpu: 32,
      storage: 500,
      bandwidth: 850,
      cost: '$320.75',
      status: 'Active',
      region: 'us-east-1'
    },
    {
      id: 3,
      name: 'S3-Bucket-Main',
      type: 'Storage',
      cpu: 5,
      storage: 1500,
      bandwidth: 2100,
      cost: '$85.30',
      status: 'Active',
      region: 'us-west-2'
    },
    {
      id: 4,
      name: 'Lambda-Function-01',
      type: 'Compute',
      cpu: 10,
      storage: 100,
      bandwidth: 450,
      cost: '$12.50',
      status: 'Active',
      region: 'us-east-1'
    },
    {
      id: 5,
      name: 'EBS-Volume-Old',
      type: 'Storage',
      cpu: 0,
      storage: 800,
      bandwidth: 0,
      cost: '$95.20',
      status: 'Idle',
      region: 'eu-west-1'
    },
    {
      id: 6,
      name: 'CloudFront-CDN',
      type: 'Networking',
      cpu: 2,
      storage: 50,
      bandwidth: 5200,
      cost: '$280.45',
      status: 'Active',
      region: 'Global'
    },
    {
      id: 7,
      name: 'EC2-Instance-02',
      type: 'Compute',
      cpu: 8,
      storage: 100,
      bandwidth: 300,
      cost: '$125.80',
      status: 'Idle',
      region: 'ap-south-1'
    },
    {
      id: 8,
      name: 'Backup-Storage',
      type: 'Storage',
      cpu: 0,
      storage: 2000,
      bandwidth: 100,
      cost: '$150.90',
      status: 'Active',
      region: 'us-west-1'
    },
  ]);

  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('All');

  // File upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      setUploadError('Invalid file type. Please upload CSV or Excel files only.');
      setTimeout(() => setUploadError(''), 5000);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      setTimeout(() => setUploadError(''), 5000);
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-report', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      
      // Update resources with analyzed data
      if (data.resources) {
        setResources(data.resources);
      }

      setUploadMessage(`File uploaded successfully! Analyzed ${data.recordsProcessed || 0} records.`);
      setTimeout(() => setUploadMessage(''), 5000);
    } catch (error) {
      setUploadError(error.message || 'Error uploading file. Please try again.');
      setTimeout(() => setUploadError(''), 5000);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const filteredResources = resources.filter(resource => 
    filterStatus === 'All' || resource.status === filterStatus
  );

  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'cost') {
      const costA = parseFloat(a.cost.replace('$', ''));
      const costB = parseFloat(b.cost.replace('$', ''));
      return costB - costA;
    }
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  const totalCost = filteredResources.reduce((sum, r) => {
    return sum + parseFloat(r.cost.replace('$', ''));
  }, 0);

  const activeResources = filteredResources.filter(r => r.status === 'Active').length;
  const idleResources = filteredResources.filter(r => r.status === 'Idle').length;

  const getUsageLevel = (value, max = 100) => {
    if (value < 30) return 'low';
    if (value < 70) return 'medium';
    return 'high';
  };

  return (
    <div className="cloudusage-container">
      <header className="cloudusage-header">
        <h1>Cloud Resources Usage</h1>
        <p>Monitor all your cloud resources, usage, and costs</p>
      </header>

      {/* File Upload Section */}
      <section className="upload-section">
        <div className="upload-container">
          <div className="upload-box">
            <input
              type="file"
              id="file-upload"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isUploading}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className={`upload-label ${isUploading ? 'uploading' : ''}`}>
              <div className="upload-icon">📁</div>
              <h3>Upload Cloud Report</h3>
              <p>AWS CUR, Azure Cost Management, or GCP Billing export</p>
              <p className="file-types">Supported: CSV, XLSX, XLS (Max 10MB)</p>
              <button 
                type="button" 
                className="upload-btn" 
                disabled={isUploading}
                onClick={() => document.getElementById('file-upload').click()}
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </button>
            </label>
          </div>
          {uploadMessage && (
            <div className="upload-message success">
              ✓ {uploadMessage}
            </div>
          )}
          {uploadError && (
            <div className="upload-message error">
              ✗ {uploadError}
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stat-card">
          <span className="stat-label">Total Resources</span>
          <span className="stat-value">{filteredResources.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Resources</span>
          <span className="stat-value active">{activeResources}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Idle Resources</span>
          <span className="stat-value idle">{idleResources}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Cost</span>
          <span className="stat-value">${totalCost.toFixed(2)}</span>
        </div>
      </section>

      {/* Filters and Sorting */}
      <section className="controls-section">
        <div className="control-group">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Idle">Idle</option>
          </select>
        </div>
        <div className="control-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="cost">Cost (High to Low)</option>
            <option value="status">Status</option>
          </select>
        </div>
      </section>

      {/* Resources Table */}
      <section className="resources-section">
        <div className="table-wrapper">
          <table className="resources-table">
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Type</th>
                <th>CPU Usage</th>
                <th>Storage (GB)</th>
                <th>Bandwidth (MB)</th>
                <th>Cost</th>
                <th>Region</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedResources.map((resource) => (
                <tr key={resource.id} className={`status-${resource.status.toLowerCase()}`}>
                  <td className="name-cell">
                    <span className="resource-name">{resource.name}</span>
                  </td>
                  <td>
                    <span className="type-badge">{resource.type}</span>
                  </td>
                  <td>
                    <div className="usage-container">
                      <div className={`usage-bar ${getUsageLevel(resource.cpu)}`}>
                        <div className="usage-fill" style={{ width: `${resource.cpu}%` }}></div>
                      </div>
                      <span className="usage-text">{resource.cpu}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="usage-container">
                      <div className={`usage-bar ${getUsageLevel(resource.storage / 20)}`}>
                        <div className="usage-fill" style={{ width: `${Math.min((resource.storage / 2000) * 100, 100)}%` }}></div>
                      </div>
                      <span className="usage-text">{resource.storage} GB</span>
                    </div>
                  </td>
                  <td>
                    <div className="usage-container">
                      <div className={`usage-bar ${getUsageLevel(resource.bandwidth / 52)}`}>
                        <div className="usage-fill" style={{ width: `${Math.min((resource.bandwidth / 5200) * 100, 100)}%` }}></div>
                      </div>
                      <span className="usage-text">{resource.bandwidth} MB</span>
                    </div>
                  </td>
                  <td>
                    <span className="cost-value">{resource.cost}</span>
                  </td>
                  <td>
                    <span className="region-badge">{resource.region}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${resource.status.toLowerCase()}`}>
                      {resource.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedResources.length === 0 && (
          <div className="no-resources">
            <p>No resources found matching your filters</p>
          </div>
        )}
      </section>
    </div>
  );
}