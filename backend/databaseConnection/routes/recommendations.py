from flask import Blueprint, request, jsonify
from models import UserModel

recommendations_bp = Blueprint("recommendations", __name__)

@recommendations_bp.route("/users/<user_id>/recommendations", methods=["POST"])
def add_recommendation(user_id):
    data = request.json
    image_id = data.get("imageId")
    url = data.get("url")
    reason = data.get("reason", "")

    if not image_id or not url:
        return jsonify({"error": "ImageId and URL are required"}), 400

    UserModel.add_recommendation(user_id, image_id, url, reason)
    return jsonify({"message": "Recommendation added"}), 201

@recommendations_bp.route("/users/<user_id>/recommendations", methods=["GET"])
def get_recommendations(user_id):
    recommendations = UserModel.get_recommendations(user_id)
    return jsonify(recommendations), 200
