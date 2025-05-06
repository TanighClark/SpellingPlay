import React from 'react';
import '../pages/styles/ActivityCard.css';

export default function ActivityCard({ title, image, description, onSelect }) {
  return (
    <article
      className="activity-card"
      role="region"
      aria-label={`Activity: ${title}`}
    >
      {image && (
        <img
          src={image}
          alt={`Illustration of the ${title} activity`}
          loading="lazy"
        />
      )}

      <div className="card-body">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <button onClick={onSelect} aria-label={`Start ${title} activity`}>
        Start
      </button>
    </article>
  );
}
