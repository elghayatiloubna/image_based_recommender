from flask import Blueprint, request, jsonify
from models import UserModel

favorites_bp = Blueprint("favorites", __name__)

@favorites_bp.route("/users/<user_id>/favorites", methods=["POST"])
def add_favorite(user_id):
    if 'image' not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    image_file = request.files['image']  # Récupère le fichier de l'image
    image_id = request.form.get("imageId")
    
    if not image_id:
        return jsonify({"error": "ImageId is required"}), 400

    # Lire le fichier binaire de l'image
    image_binary = image_file.read()

    # Ajouter aux favoris
    UserModel.add_favorite(user_id, image_id, image_binary)
    return jsonify({"message": "Favorite added"}), 201

@favorites_bp.route("/users/<user_id>/favorites", methods=["GET"])
def get_favorites(user_id):
    favorites = UserModel.get_favorites(user_id)
    return jsonify(favorites), 200


@favorites_bp.route("/users/<user_id>/favorites/<image_id>", methods=["DELETE"])
def remove_favorite(user_id, image_id):
    success = UserModel.remove_favorite(user_id, image_id)
    if success:
        return jsonify({"message": "Favorite removed"}), 200
    else:
        return jsonify({"error": "Favorite not found or already removed"}), 404
