from flask import Flask
from flask_cors import CORS
from utils.db import init_db
from routes.users import users_bp
from routes.favorites import favorites_bp
from routes.recommendations import recommendations_bp

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/travel_recommenderSystem"
# Activer CORS pour l'origine de votre frontend
CORS(app)

# Initialize MongoDB
init_db(app)

# Register routes
app.register_blueprint(users_bp)
app.register_blueprint(favorites_bp)
app.register_blueprint(recommendations_bp)


if __name__ == "__main__":
    app.run(debug=True, port=5001)
