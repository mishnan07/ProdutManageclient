import React from 'react';

const InstagramProfilePreview = () => {
  return (
    <div style={{
      width: '360px',
      border: '1px solid #dbdbdb',
      borderRadius: '12px',
      padding: '16px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#fff',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    }}>
      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <img
          src="https://via.placeholder.com/60" // Replace with your real profile image URL
          alt="Profile"
          style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '12px' }}
        />
        <div>
          <h3 style={{ margin: '0', fontSize: '18px' }}>fighter_holidays_official</h3>
          <span style={{ color: '#888', fontSize: '14px' }}>Travel Agency</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
        <div><strong>132</strong><br />Posts</div>
        <div><strong>4.5K</strong><br />Followers</div>
        <div><strong>150</strong><br />Following</div>
      </div>

      {/* Bio */}
      <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>
        ✈️ Explore the world with us<br />
        📍 Fighter Holidays | Adventure & Travel<br />
        🌐 www.fighterholidays.com
      </p>

      {/* CTA Button */}
      <a
        href="https://www.instagram.com/fighter_holidays_official/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          backgroundColor: '#d6249f',
          color: '#fff',
          textAlign: 'center',
          padding: '10px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}
      >
        View Full Profile
      </a>
    </div>
  );
};

export default InstagramProfilePreview;
