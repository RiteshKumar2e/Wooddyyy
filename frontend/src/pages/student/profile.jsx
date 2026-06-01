import React, { useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: 'Mansi',
    email: 'guest@mansi.com',
    phone: '',
    goal: 'Stay consistent with study blocks',
    timezone: 'IST',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => {
    setSaved(false);
    setProfile({ ...profile, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="profile-panel">
      <div className="panel-header">
        <h2 className="panel-title">👤 Profile</h2>
        <p className="panel-subtitle">Change your details here. This sits under Timetable in the dashboard menu.</p>
      </div>

      <div className="profile-layout sketch-border sketch-shadow">
        <div className="profile-card-preview sketch-border-sm">
          <div className="profile-avatar">M</div>
          <h3 className="profile-name">{profile.fullName || 'Mansi'}</h3>
          <p className="profile-mail">{profile.email || 'guest@mansi.com'}</p>
          <div className="profile-badge">{profile.timezone}</div>
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

      <style>{`
        .profile-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .profile-layout {
          background: var(--wood-card);
          padding: 24px;
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          gap: 20px;
        }

        .profile-card-preview {
          background: var(--wood-bg);
          padding: 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 10px;
        }

        .profile-avatar {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background: var(--wood-primary);
          color: var(--wood-ink);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--heading);
          font-size: 34px;
          font-weight: 700;
          border: 2px solid var(--wood-ink);
        }

        .profile-name {
          font-family: var(--heading);
          font-size: 22px;
          font-weight: 700;
        }

        .profile-mail {
          font-size: 13px;
          color: var(--wood-ink-muted);
          word-break: break-word;
        }

        .profile-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 12px;
          background: var(--wood-accent);
          border: 1.5px solid var(--wood-ink);
          border-radius: 999px;
          font-family: var(--heading);
          font-size: 12px;
          font-weight: 700;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-family: var(--heading);
          font-weight: 600;
          font-size: 13px;
        }

        .form-input {
          width: 100%;
          padding: 10px 12px;
          background: var(--wood-card);
          color: var(--wood-ink);
          border: 2px solid var(--wood-ink);
          outline: none;
          font-family: var(--sans);
          font-size: 14px;
        }

        .profile-textarea {
          resize: vertical;
          min-height: 110px;
        }

        .profile-saved {
          font-size: 24px;
          color: var(--wood-primary);
          text-align: center;
        }

        .profile-save-btn {
          align-self: flex-start;
        }

        @media (max-width: 860px) {
          .profile-layout {
            grid-template-columns: 1fr;
          }

          .form-grid-2 {
            grid-template-columns: 1fr;
          }

          .profile-save-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
