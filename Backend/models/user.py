from datetime import datetime
from bson import ObjectId
from database import users_collection


class User:
    @staticmethod
    def to_dict(doc):
        if not doc:
            return None
        return {
            "id": str(doc.get("_id")),
            "email": doc.get("email"),
            "name": doc.get("name") or doc.get("email", "").split("@")[0].capitalize(),
            "avatar": doc.get("avatar") or "/assets/anivex-avatar.png",
            "role": doc.get("role"),  # None if role has not been selected yet
            "google_id": doc.get("google_id"),
            "created_at": doc.get("created_at").isoformat() if isinstance(doc.get("created_at"), datetime) else doc.get("created_at"),
            "updated_at": doc.get("updated_at").isoformat() if isinstance(doc.get("updated_at"), datetime) else doc.get("updated_at"),
        }

    @staticmethod
    def find_by_email(email):
        if not email:
            return None
        doc = users_collection.find_one({"email": email.strip().lower()})
        return doc

    @staticmethod
    def find_by_id(user_id):
        try:
            doc = users_collection.find_one({"_id": ObjectId(user_id)})
            return doc
        except Exception:
            return None

    @staticmethod
    def create(email, name=None, avatar=None, role=None, google_id=None):
        email_clean = email.strip().lower()
        now = datetime.utcnow()
        display_name = name or email_clean.split("@")[0].capitalize()

        user_doc = {
            "email": email_clean,
            "name": display_name,
            "avatar": avatar or "/assets/anivex-avatar.png",
            "role": role,  # None by default until user selects role
            "google_id": google_id,
            "created_at": now,
            "updated_at": now,
        }

        result = users_collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        return user_doc

    @staticmethod
    def update(user_id, update_data):
        try:
            update_data["updated_at"] = datetime.utcnow()
            users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            return User.find_by_id(user_id)
        except Exception:
            return None

    @staticmethod
    def set_role(user_id, role):
        if not role or role.lower() not in ["editor", "creator"]:
            return None
        return User.update(user_id, {"role": role.lower()})

