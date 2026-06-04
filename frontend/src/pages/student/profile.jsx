import React, { useState } from 'react';
import '../../styles/student/profile.css';

const fallbackProfile = {
  fullName: '',
  email: '',
  phone: '',
  goal: '',
  timezone: '',
};

export default function Profile({ profile: profileProp, onSave }) {
  const [profile, setProfile] = useState(profileProp || fallbackProfile);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    setProfile(profileProp || fallbackProfile);
  }, [profileProp]);

  const handleChange = (field) => (e) => {
    setSaved(false);
    setProfile({ ...profile, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    if (onSave) {
      onSave(profile);
    }
  };

  return (
    <div className="profile-panel">
      <div className="panel-header">
        <h2 className="panel-title">👤 Profile</h2>
        <p className="panel-subtitle">Change your details here. This sits under Timetable in the dashboard menu.</p>
      </div>

      <div className="profile-layout sketch-border sketch-shadow">
        <div className="profile-card-preview sketch-border-sm">
          <div className="profile-avatar">{profile.fullName ? profile.fullName.trim().charAt(0).toUpperCase() : '—'}</div>
          <h3 className="profile-name">{profile.fullName || 'Your name here'}</h3>
          <p className="profile-mail">{profile.email || 'Add your email in the form'}</p>
          <div className="profile-badge">{profile.timezone || 'Timezone'}</div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                className="form-input sketch-border-sm"
                value={profile.fullName}
                onChange={handleChange('fullName')}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-timezone">Timezone</label>
              <select
                id="profile-timezone"
                className="form-input sketch-border-sm"
                value={profile.timezone}
                onChange={handleChange('timezone')}
              >
                <option value="" disabled>Select timezone</option>
                <option value="IST">IST</option>
                <option value="UTC">UTC</option>
                <option value="GMT">GMT</option>
                <option value="EST">EST</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              type="email"
              className="form-input sketch-border-sm"
              value={profile.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-phone">Phone Number</label>
            <input
              id="profile-phone"
              type="tel"
              className="form-input sketch-border-sm"
              value={profile.phone}
              onChange={handleChange('phone')}
              placeholder="Your contact number"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-goal">Study Goal</label>
            <textarea
              id="profile-goal"
              className="form-input sketch-border-sm profile-textarea"
              rows="4"
              value={profile.goal}
              onChange={handleChange('goal')}
              placeholder="What do you want to improve this week?"
            />
          </div>

          {saved && <div className="profile-saved handwritten">Saved locally for this session.</div>}

          <button type="submit" className="btn-sketch btn-sketch-primary sketch-border sketch-shadow profile-save-btn">
            Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
}
