import os
import numpy as np
import pandas as pd
import tensorflow as tf
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from flask_cors import CORS

# Vous pouvez spécifier les origines autorisées

# Chemins locaux
base_path = './'
models_dir = os.path.join(base_path)
features_csv_path = os.path.join(models_dir, 'combined_features.csv')
images_dir = os.path.join(base_path, '../gldv2Micro/images')

# Charger le modèle
model_path = os.path.join(models_dir, 'feature_extractor_resnet50')
# Charger le modèle à partir du dossier SavedModel
feature_extractor =  tf.saved_model.load(model_path)

# Charger les features combinés
combined_df = pd.read_csv(features_csv_path)

# Extraire les features et labels
features = combined_df.iloc[:, :-1].values  # Toutes les colonnes sauf la dernière
labels = combined_df['label'].values

# Charger les données d'entraînement pour mapping (landmark_id -> filename)
train_csv_path = os.path.join(base_path, '../gldv2_micro.csv')
train_data = pd.read_csv(train_csv_path)

# Initialiser Flask
app = Flask(__name__)
# Vous pouvez spécifier les origines autorisées
# Autoriser CORS pour l'origine de votre frontend
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],  # Autoriser uniquement votre frontend
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Access-Control-Allow-Origin"],
        "supports_credentials": True
    }
})

# Fonction pour extraire les features d'une image
def extract_features(image_path):
    img = image.load_img(image_path, target_size=(224, 224))  # Taille pour ResNet
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Ajouter une dimension batch
    img_array /= 255.0  # Normaliser
    # Effectuer l'inférence avec le modèle chargé
    infer = feature_extractor.signatures["serving_default"]  # Utiliser l'endpoint par défaut pour l'inférence
    features = infer(tf.convert_to_tensor(img_array))  # Convertir en tensor pour l'inférence
    return features["global_average_pooling2d"].numpy().flatten()  # Récupérer les features extraits (selon la structure du modèle)  # Extraire les features


# Fonction pour trouver des images similaires
def find_similar_images(query_features, top_k=20):
    # Normaliser les features avant de calculer la similarité
    features_normalized = features / np.linalg.norm(features, axis=1, keepdims=True)
    query_features_normalized = query_features / np.linalg.norm(query_features)
    
    similarities = np.dot(features_normalized, query_features_normalized.T)  # Similarité cosinus
    similar_indices = np.argsort(similarities, axis=0)[-top_k:][::-1]  # Top K
    
    similar_landmark_ids = labels[similar_indices]  # IDs correspondants
    similar_scores = similarities[similar_indices]  # Scores de similarité
    
    filenames = []
    scores = []
    for i, landmark_id in enumerate(np.unique(similar_landmark_ids)):
        filename = train_data[train_data['landmark_id'] == landmark_id]['filename'].iloc[0]
        filenames.append(filename)
        scores.append(similar_scores[i])

    return filenames, scores



@app.route('/recommend', methods=['POST' ,'OPTIONS'],)
def recommend():
    if 'image' not in request.files:
        return jsonify({"error": "Image file is missing"}), 400

    # Sauvegarder temporairement l'image
    img = request.files['image']
    temp_image_path = os.path.join(base_path, 'temp_image.jpg')
    img.save(temp_image_path)

    try:
        # Extraire les features de l'image
        query_features = extract_features(temp_image_path)

        # Trouver les images similaires
        similar_filenames, scores = find_similar_images(query_features)

        # Créer la réponse
        response = jsonify({"recommendations": [{"filename": filename, "similarity_score": score} 
                                                for filename, score in zip(similar_filenames, scores)]})


        return response

    finally:
        # Supprimer l'image temporaire
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)
@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True, port=5003)
