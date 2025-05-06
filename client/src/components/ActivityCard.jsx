// client/src/components/ActivityCard.jsx
import React from 'react';
import '../pages/styles/ActivityCard.css'; // Import your CSS file

export default function ActivityCard({ title, image, description, onSelect }) {
  return (
    <div className="activity-card">
      {image && <img src={image} alt={title} />}

      <div className="card-body">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <button onClick={onSelect}>Start</button>
    </div>
  );
}
