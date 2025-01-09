from flask import Flask, request, jsonify
from flask_cors import CORS 
import tensorflow as tf
from PIL import Image 
import numpy as np
from joblib import load

# Initialize the Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load the trained CNN model for accident type classification
try:
    cnn_model = tf.keras.models.load_model('models/version19-CNN-sequential.h5')
    print("CNN model loaded successfully!")
except Exception as e:
    raise RuntimeError(f"Failed to load the CNN model: {e}")

# Load the multi-label classification model
try:
    multi_label_model = load('models/tuned_multi_label_RF_model.pkl')
    print("Multi-label classification model loaded successfully!")
except Exception as e:
    raise RuntimeError(f"Failed to load the multi-label model: {e}")

# Define accident type labels
accident_types = [
    "Head On Collision",
    "Rear End Collision",
    "Single Vehicle Accident",
    "T Bone Collision"
]

# Define law violation categories
law_violation_categories = [
    "Driving Documentation Compliance Violation",
    "Public Safety Breaches from Hazardous Driving",
    "Unsafe Vehicle Condition and Road Safety Negligence",
    "Public Transportation Regulatory Compliance Violation"
]

# Route to handle image upload and prediction for accident type
@app.route('/predict_accident_type', methods=['POST'])
def predict_accident_type():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    try:
        # Load and preprocess the image
        image = Image.open(file).convert('RGB')  # Ensure RGB format
        image = image.resize((240, 200))  # Resize to match your model input size
        image_array = np.array(image) / 255.0  # Normalize
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension

        # Predict
        predictions = cnn_model.predict(image_array)
        predicted_class = np.argmax(predictions[0])
        accident_type = accident_types[predicted_class]

        return jsonify({'prediction': accident_type}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to handle prediction for law violation categories
@app.route('/predict_law_violation', methods=['POST'])
def predict_law_violation():
    try:
        # Ensure JSON data is provided
        if not request.json:
            return jsonify({'error': 'No input data provided'}), 400

        # Extract features from request
        required_features = [
            "Causing Deaths", "Causing Severe Injuries", "Causing Minor Injuries",
            "Public Transportation Involved", "Last Speedometer Value",
            "Vehicle Condition", "Breath Test for Alcohol", "Driving License Status",
            "Vehicle Registration Status", "Insurance Cover Status", "Evidence of Mobile Phone Usage",
            "Evidence of Proper Signal Usage", "Evidence of Road Signs Breaches"
        ]

        # Check if all required features are present
        input_data = request.json
        missing_features = [feature for feature in required_features if feature not in input_data]
        if missing_features:
            return jsonify({'error': f'Missing features: {missing_features}'}), 400

        # Prepare input array for the model
        feature_values = [input_data[feature] for feature in required_features]
        feature_array = np.array([feature_values])

        # Predict using the multi-label classification model
        predictions = multi_label_model.predict(feature_array)
        predicted_categories = [
            category for category, value in zip(law_violation_categories, predictions[0]) if value == 1
        ]

        return jsonify({'predictions': predicted_categories}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)