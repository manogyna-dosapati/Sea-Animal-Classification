import os
import random
import numpy as np
from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
from PIL import Image

try:
    import tensorflow as tf
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False
    print("Warning: TensorFlow not found. Using mock predictions.")

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# 9 Marine Species Classes
CLASSES = [
    "Coral", "Fish", "Jelly Fish", "Lobster", 
    "Penguin", "Seal", "Sharks", "Squid", "Turtle"
]

MODEL_PATH = "model.h5"
model = None

# Try loading the model if TensorFlow is available and file exists
if TF_AVAILABLE and os.path.exists(MODEL_PATH):
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        print(f"Model loaded successfully from {MODEL_PATH}")
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    print(f"Model {MODEL_PATH} not found or TF unavailable. Using mock predictions for frontend demo.")

def preprocess_image(image_path):
    """
    Center crop, resize to 192x192, convert to RGB, and scale.
    """
    img = Image.open(image_path).convert('RGB')
    
    # Center crop
    width, height = img.size
    new_size = min(width, height)
    left = (width - new_size) / 2
    top = (height - new_size) / 2
    right = (width + new_size) / 2
    bottom = (height + new_size) / 2
    img = img.crop((left, top, right, bottom))
    
    # Resize
    img = img.resize((192, 192))
    
    # Convert to array and expand dims
    img_array = np.array(img)
    
    # EfficientNetV2 expects inputs in [0, 255] for some TF versions or it has internal scaling,
    # but we can standard normalize or leave as is based on the specific training setup.
    # We'll just expand dims for batch size of 1.
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
        
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            img_array = preprocess_image(filepath)
            
            if model is not None:
                # Actual prediction
                predictions = model.predict(img_array)
                class_idx = np.argmax(predictions[0])
                confidence = float(predictions[0][class_idx])
                predicted_class = CLASSES[class_idx]
            else:
                # Mock prediction for demonstration
                predicted_class = random.choice(CLASSES)
                confidence = round(random.uniform(0.85, 0.99), 4)
            
            # Clean up the uploaded file to save space
            if os.path.exists(filepath):
                os.remove(filepath)
                
            return jsonify({
                'class': predicted_class,
                'confidence': f"{confidence * 100:.2f}%"
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
