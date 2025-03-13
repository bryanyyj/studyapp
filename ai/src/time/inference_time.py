import torch
import torch.nn.functional as F
import numpy as np
import pickle
from flask import Flask, request, jsonify

# Import only the model definition from train_time.py.
from train_time import StudyDurationPredictor

app = Flask(__name__)

# 1) Load Model and Scaler
model = StudyDurationPredictor(input_dim=3)
model.load_state_dict(torch.load("study_duration_model.pth", map_location=torch.device('cpu')))
model.eval()

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Define class centers (in minutes) corresponding to the model's 4 classes.
# Adjust these values based on your training data distribution.
class_centers = np.array([20, 44, 70, 110], dtype=np.float32)

@app.route('/predict', methods=['POST'])
def predict():
    """
    Expects JSON with keys:
      - "sessionDuration" (float, in hours)
      - "breakTime" (float, in hours)
      - "scheduleSatisfaction" (float)
    Assumes both sessionDuration and breakTime are already in hours,
    scales features, and returns:
      - "prediction_time": continuous predicted study time in minutes (e.g. "44 mins")
      - "prediction_break": static string "5 mins intervals"
      - "probabilities": raw softmax probabilities from the model
    """
    try:
        data = request.get_json()
        # Values are assumed to be in hours already.
        session_duration = float(data['sessionDuration'])  # hours
        break_time = float(data['breakTime'])              # hours
        schedule_satisfaction = float(data['scheduleSatisfaction'])
    except (KeyError, ValueError):
        return jsonify({
            "error": "Invalid or missing keys. Expect sessionDuration, breakTime, scheduleSatisfaction."
        }), 400

    # Construct the input feature array: [session_duration, break_time, schedule_satisfaction]
    features = np.array([[session_duration, break_time, schedule_satisfaction]], dtype=np.float32)
    features_scaled = scaler.transform(features)
    features_tensor = torch.tensor(features_scaled, dtype=torch.float32)

    # Get model prediction: logits for 4 classes
    with torch.no_grad():
        logits = model(features_tensor)
        probabilities = F.softmax(logits, dim=1).numpy()[0]
    
    # Compute a continuous predicted study time (in minutes) using a weighted average of class centers.
    predicted_minutes = float(np.dot(probabilities, class_centers))
    
    # Build the response
    response = {
        "prediction_time": f"{predicted_minutes:.0f} mins",  # e.g., "44 mins"
        "prediction_break": "5 mins intervals",              # static text
        "probabilities": probabilities.tolist()
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
