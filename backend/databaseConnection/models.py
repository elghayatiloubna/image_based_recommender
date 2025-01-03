import base64
from utils.db import mongo
from datetime import datetime

class UserModel:
    @staticmethod
    def add_favorite(user_id, image_id, image_binary):
        # Convertir l'image binaire en chaîne Base64
        image_base64 = base64.b64encode(image_binary).decode('utf-8')
        # Ajouter la date actuelle
        created_at = datetime.utcnow().isoformat()  # Format ISO 8601 pour la date
        mongo.db.users.update_one(
            {"_id": user_id},
            {"$addToSet": {
                "favorites": {
                    "imageId": image_id,
                    "imageBase64": image_base64,
                    "createdAt": created_at,  # Enregistrer la date de création
                }
            }},
        )
    

    @staticmethod
    def get_favorites(user_id):
        user = mongo.db.users.find_one({"_id": user_id})
        if not user:
            return []
        
        favorites = user.get("favorites", [])

        # Trier les favoris par `createdAt` dans l'ordre décroissant
        sorted_favorites = sorted(
            favorites,
            key=lambda x: x.get("createdAt", ""),  # Si createdAt est absent, retournez une chaîne vide
            reverse=True
        )
        
        return [
            {
                "imageId": fav["imageId"],
                "imageBase64": fav["imageBase64"],
                "createdAt": fav.get("createdAt")  # Inclure `createdAt` dans la réponse
            }
            for fav in sorted_favorites
        ]
    


    @staticmethod
    def add_recommendation(user_id, image_id, url, reason):
        mongo.db.users.update_one(
            {"_id": user_id},
            {"$addToSet": {
                "recommendations": {
                    "imageId": image_id,
                    "url": url,
                    "reason": reason,
                }
            }},
        )

    @staticmethod
    def get_recommendations(user_id):
        user = mongo.db.users.find_one({"_id": user_id})
        return user.get("recommendations", []) if user else []
    
    @staticmethod
    def remove_favorite(user_id, image_id):
        result = mongo.db.users.update_one(
            {"_id": user_id},
            {"$pull": {"favorites": {"imageId": image_id}}}
        )
        return result.modified_count > 0  
