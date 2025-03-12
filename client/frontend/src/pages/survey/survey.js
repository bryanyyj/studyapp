import React, { useState } from 'react';
import './survey.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Survey = () => {

  const navigate = useNavigate();


  const questions = [
    {
      id: 1,
      questionText: 'How long is your typical study session?',
      options: [
        "Less than 30 minutes",
        "30-60 minutes",
        "1-2 hours",
        "More than 2 hours"
      ]
    },
    {
      id: 2,
      questionText: 'How many study sessions do you have in a day?',
      options: ['1', '2', '3']
    },
    {
      id: 3,
      questionText: 'At what time of day do you prefer to study?',
      options: ['Morning', 'Afternoon', 'Evening', 'Night']
    },
    {
      id: 4,
      questionText: 'How long are your break sessions?',
      options: ['5-10mins', '15-20mins', '25-30mins', '1hr+']
    },
    {
      id: 5,
      questionText: 'What is your favorite thing to do during your break?',
      options: ['Power nap', 'Short walk', 'Snack break', 'Social media']
    },
    {
      id: 6,
      questionText: 'How satisfied are you with your current study schedule?',
      options: ['1 - Least Satisfied', '2', '3', '4', '5 - Very Satisfied']
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({
    studyDuration: '',
    studySessions: '',
    studyTime: '',
    breakDuration: '',
    breakActivity: '',
    satisfactionLevel: ''
  });

  const handleNext = () => {
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => prev - 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setResponses((prevResponses) => ({
      ...prevResponses,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const satisfactionLevel = responses.satisfactionLevel;
    if (satisfactionLevel != responses.satisfactionLevel) {
      alert('Please select an option before submitting.');
      return;
    }

    console.log('User Satisfaction Level:', satisfactionLevel);
    alert('Thank you for completing the survey!');
    navigate('/main'); 
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
      </div>

      <div className="container">
        <div className="survey-form">
          <h1>Question {currentQuestion.id} of 6</h1>
          <p className="question-text">{currentQuestion.questionText}</p>

          <label htmlFor={currentQuestion.id}>{currentQuestion.questionText}</label>
          <select
            id={currentQuestion.id}
            name={currentQuestion.id}
            value={responses[currentQuestion.id]}
            onChange={handleChange}
            required
          >
            <option value="" disabled selected>
              Select an option
            </option>
            {currentQuestion.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="navigation-buttons">
            {currentQuestion.id > 1 && (
              <button
                type="button"
                className="submit-btn back-btn"
                onClick={handlePrevious}
              >
                Back
              </button>
            )}

            {currentQuestion.id < 6 ? (
              <button
                type="button"
                className="submit-btn next-btn"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className="submit-btn submit-survey-btn"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;
