import { useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [userDetails, setUserDetails] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Admin',
    company: 'Tech Solutions Inc.',
    joinDate: '2023-06-15',
    accountStatus: 'Active'
  });

  const [editMode, setEditMode] = useState(false);
  const [editDetails, setEditDetails] = useState(userDetails);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDetails({ ...editDetails, [name]: value });
  };

  const handleSaveDetails = () => {
    setUserDetails(editDetails);
    setEditMode(false);
    alert('Profile details updated successfully!');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!passwordForm.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    if (!passwordForm.newPassword) {
      setPasswordError('New password is required');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    // Success
    setPasswordSuccess('Password changed successfully!');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear any stored authentication data
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      
      // Redirect to login
      navigate('/');
    }
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account settings and preferences</p>
      </header>

      <div className="profile-content">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {userDetails.firstName.charAt(0)}{userDetails.lastName.charAt(0)}
            </div>
            <h3>{userDetails.firstName} {userDetails.lastName}</h3>
            <p className="role-badge">{userDetails.role}</p>
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-item ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              👤 Profile Details
            </button>
            <button
              className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              🔐 Change Password
            </button>
            <button
              className={`nav-item logout`}
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="profile-main">
          {/* Profile Details Tab */}
          {activeTab === 'details' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Profile Details</h2>
                {!editMode && (
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setEditMode(true);
                      setEditDetails(userDetails);
                    }}
                  >
                    ✎ Edit Profile
                  </button>
                )}
              </div>

              {editMode ? (
                <form className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={editDetails.firstName}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={editDetails.lastName}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={editDetails.email}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editDetails.phone}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      name="company"
                      value={editDetails.company}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-save"
                      onClick={handleSaveDetails}
                    >
                      ✓ Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setEditMode(false)}
                    >
                      ✕ Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="details-display">
                  <div className="detail-item">
                    <span className="detail-label">First Name</span>
                    <span className="detail-value">{userDetails.firstName}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Last Name</span>
                    <span className="detail-value">{userDetails.lastName}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{userDetails.email}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">{userDetails.phone}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Company</span>
                    <span className="detail-value">{userDetails.company}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Role</span>
                    <span className="detail-value">{userDetails.role}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Account Status</span>
                    <span className="detail-value status-active">{userDetails.accountStatus}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Member Since</span>
                    <span className="detail-value">{new Date(userDetails.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Change Password</h2>
              </div>

              <form className="password-form" onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="password-input-group">
                    <input
                      type={showPassword.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      className="btn-toggle-password"
                      onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    >
                      {showPassword.current ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <div className="password-input-group">
                    <input
                      type={showPassword.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your new password (minimum 8 characters)"
                    />
                    <button
                      type="button"
                      className="btn-toggle-password"
                      onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    >
                      {showPassword.new ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <small className="password-hint">Minimum 8 characters required</small>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="password-input-group">
                    <input
                      type={showPassword.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      className="btn-toggle-password"
                      onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    >
                      {showPassword.confirm ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <div className="alert alert-error">
                    <span>⚠️</span> {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="alert alert-success">
                    <span>✓</span> {passwordSuccess}
                  </div>
                )}

                <button type="submit" className="btn-change-password">
                  Update Password
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}