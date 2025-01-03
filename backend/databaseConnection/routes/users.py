from flask import Blueprint, jsonify

users_bp = Blueprint("users", __name__)

@users_bp.route("/users/<user_id>", methods=["GET"])
def get_user(user_id):
    user = UserModel.get_user_by_id(user_id)
    if user:
        return jsonify(user), 200
    return jsonify({"message": "User not found"}), 404
