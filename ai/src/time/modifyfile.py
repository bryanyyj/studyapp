import pandas as pd
import numpy as np

# Load the dataset
df = pd.read_csv("C:/Users/bryan/studyapp/ai/src/time/time_data_modified.csv")

# Mapping function for session duration
duration_mapping = {
    'Less than 30 minutes': 0,
    '30-60 minutes': 1,
    '1-2 hours': 2,
    'More than 2 hours': 3
}

reverse_duration_mapping = {v: k for k, v in duration_mapping.items()}

# Mapping function for break frequency impact
break_impact = {
    'Never': -1,      # No break might lead to a reduction in study effectiveness
    'Rarely': 0,      # Minimal impact
    'Sometimes': 1,   # Small increase
    'Often': 2,       # Moderate increase
    'Always': 3       # Frequent breaks may increase effectiveness up to a point
}

# Generate "Tomorrow Study Session Duration"
def generate_tomorrow_duration(row):
    current_duration = duration_mapping.get(row['Typical Study Session Duration'], 1)
    break_modifier = break_impact.get(row['Break Frequency'], 0)
    satisfaction_modifier = row['Schedule Satisfaction'] - 3  # Centered at 3
    
    # Apply changes
    new_duration = current_duration + (break_modifier + satisfaction_modifier) // 2
    
    # Ensure it stays within valid range
    new_duration = max(0, min(3, new_duration))
    
    return reverse_duration_mapping[new_duration]

# Apply the function
df["Tomorrow Study Session Duration"] = df.apply(generate_tomorrow_duration, axis=1)

# Save the modified dataset
df.to_csv("C:/Users/bryan/studyapp/ai/src/time/time_data_modified2.csv", index=False)
