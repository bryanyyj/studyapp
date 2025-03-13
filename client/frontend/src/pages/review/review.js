import React, { useState } from 'react';
import './review.css'; 
import { useNavigate } from 'react-router-dom';

const Review = () => {
  const navigate = useNavigate()
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Handle emoji selection
  const handleEmojiClick = (value) => {
    setSelectedEmoji(value); // e.g. 1, 2, 3, 4, 5
  };

  // Handle rating selection
  const handleRatingClick = (value) => {
    setSelectedRating(value); // e.g. 1, 2, 3, 4, 5
  };

  // Handle form submission
  const handleSubmitReview = (e) => {
    e.preventDefault();
  
    // Ensure all necessary data exists
    const reviewData = {
      sessionDuration: localStorage.getItem("studyDuration"), // Replace with dynamic value if needed
      rating: selectedEmoji, // Ensure `selectedEmoji` is set
      scheduleSatisfaction: selectedRating, // Ensure `selectedRating` is set
      feedback: feedback, // Ensure `feedback` is set
      user_id: localStorage.getItem("user_id"),
      session_id: localStorage.getItem("session_id")
    };
  
    // Ensure user_id and session_id are available
    if (!reviewData.user_id || !reviewData.session_id) {
      alert("User or session information is missing.");
      return;
    }
  
    // API endpoints
    const reviewUrl = 'http://localhost:5000/api/reviews';
    
    // Fetch request to submit the review
    fetch(reviewUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    })
    .then(response => {
      console.log("Review API Response:", response); // Debugging
      if (!response.ok) throw new Error('Failed to submit review');
      return response.json();
    })
    .then((data) => {
      console.log('Review submitted:', data);
      localStorage.setItem('review_id', data.review_id); // Store review ID if returned
      alert('Review submitted successfully!');
      navigate("/profile");
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    });
  };
  
  
  return (
    <div className="body">
      <div className="logo">
        <img src="https://i.imgur.com/FLXaWSm.png" alt="Logo" />
      </div>

      <div className="container">
        <h1>Study Session Review</h1>
        <div className="timer">⏳ 45:00</div>
        <p>How was your study session?</p>

        {/* Emoji Rating */}
        <div className="emoji-rating">
          {['😡', '😞', '😐', '😊', '🤩'].map((emoji, index) => (
            <span
              key={index}
              className={`emoji ${selectedEmoji === index + 1 ? 'selected' : ''}`}
              onClick={() => handleEmojiClick(index + 1)}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* AI Suggestion Satisfaction */}
        <p>How satisfied are you with the AI suggestion?</p>
        <div className="rating-container">
          <div className="satisfaction-buttons">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="rating-item">
                {num === 1 && <span className="rating-label-above">Poor</span>}
                {num === 5 && <span className="rating-label-above">Excellent</span>}
                {num !== 1 && num !== 5 && <span className="rating-label-above empty-label"></span>}
                <button
                  className={`rating-btn ${selectedRating === num ? 'selected' : ''}`}
                  onClick={() => handleRatingClick(num)}
                >
                  {num}
                </button>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmitReview}>
          <textarea
            className="feedback-box"
            placeholder="Optional feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button className="submit-btn" type="submit">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default Review;
