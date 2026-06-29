<div align="center">
  <h1>🌊 OceanicAI: Sea Animal Classification</h1>
  <p><i>A Deep Learning Web Application for Classifying Marine Life</i></p>
  
  [![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
  [![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)](https://www.tensorflow.org/)
  [![Flask](https://img.shields.io/badge/Flask-Backend-green.svg)](https://flask.palletsprojects.com/)
  [![HTML/CSS/JS](https://img.shields.io/badge/Frontend-Glassmorphism-purple.svg)]()
</div>

<br />

## 📖 Project Overview
This project presents a robust deep learning system capable of classifying underwater sea animals. Built using transfer learning with **EfficientNetV2B0**, the model is deployed as a fully functional, real-time **Flask web application**. The interface features a premium glassmorphism design with seamless drag-and-drop interactions.

## ✨ Key Features
- **9 Marine Species Classified**: Coral, Fish, Jelly Fish, Lobster, Penguin, Seal, Sharks, Squid, and Turtle.
- **High Accuracy**: Achieved ~90% accuracy utilizing data augmentation and transfer learning.
- **Resilient Pipeline**: Preprocessing mitigates common underwater challenges such as blur, low visibility, and color distortion.
- **Premium UI/UX**: Responsive glassmorphism frontend with dynamic animated backgrounds, drag-and-drop file upload, and AJAX-powered instant predictions.
- **Ready for Deployment**: Clean architecture ready to be containerized or hosted on cloud platforms.

---

## 🛠️ Tech Stack
* **Deep Learning Framework**: TensorFlow / Keras
* **Base Architecture**: EfficientNetV2B0 (ImageNet Pretrained)
* **Backend**: Python, Flask, NumPy, Pillow
* **Frontend**: Vanilla HTML5, CSS3, JavaScript (AJAX)

---

## 🧠 Model Methodology

### Data Preprocessing & Augmentation
To ensure high robustness, images undergo extensive preprocessing:
- **Resizing & Cropping**: Center-cropped and resized to `192 × 192` (RGB).
- **Augmentation**: Random Rotations, Horizontal/Vertical Flips, Zoom, and Contrast adjustments to prevent overfitting.

### Architecture Details
- Base: `EfficientNetV2B0`
- Upper Layers Fine-Tuned for the specific Kaggle Dataset (~8,000 images)
- Layers Added: Global Average Pooling → Dense (512, ReLU) → Batch Normalization → Dropout (0.3) → Softmax (9 classes)
- Optimizer: `Adam` (Learning Rate: 3×10⁻⁵)

---

## 🚀 How to Run Locally

Follow these steps to test the application on your local machine:

**1. Clone the repository**
```bash
git clone https://github.com/manogyna-dosapati/Sea-Animal-Classification.git
cd Sea-Animal-Classification
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Run the application**
```bash
python app.py
```

**4. View in Browser**
Open your web browser and navigate to `http://localhost:5000`. 
*(Note: If the `model.h5` weights file is absent, the app gracefully falls back to mock predictions to maintain frontend interactivity for demonstration).*

---

## 🔮 Future Work
- **Expand Dataset**: Include a wider variety of marine species and edge-case environments.
- **Edge Deployment**: Optimize the model using TFLite for deployment on underwater ROVs or mobile devices.
- **Image Enhancement Pipeline**: Add pre-inference color correction specifically tailored for deep-water photos.

---
<div align="center">
  <p><i>Developed for marine research, biodiversity monitoring, and educational purposes.</i></p>
</div>
