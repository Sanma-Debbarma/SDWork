from datetime import datetime
from bson import ObjectId
from database import projects_collection


class ProjectModel:
    @staticmethod
    def to_dict(doc):
        if not doc:
            return None

        # Format budget string nicely if missing
        budget_str = doc.get("budget")
        if not budget_str:
            b_min = doc.get("budgetMin", 0)
            b_max = doc.get("budgetMax", 0)
            if b_min and b_max:
                budget_str = f"${b_min:,} - ${b_max:,}"
            elif b_max:
                budget_str = f"Up to ${b_max:,}"
            else:
                budget_str = "Negotiable"

        created_at_val = doc.get("created_at")
        if isinstance(created_at_val, datetime):
            created_at_iso = created_at_val.isoformat()
        else:
            created_at_iso = str(created_at_val) if created_at_val else datetime.utcnow().isoformat()

        return {
            "id": str(doc.get("_id")),
            "creator_id": str(doc.get("creator_id", "")),
            "title": doc.get("title", ""),
            "category": doc.get("category", "General"),
            "description": doc.get("description", ""),
            "budget": budget_str,
            "budgetMin": int(doc.get("budgetMin") or 0),
            "budgetMax": int(doc.get("budgetMax") or 0),
            "deadline": doc.get("deadline", "Open"),
            "files": doc.get("files", []),
            "status": doc.get("status", "open"),
            "created_at": created_at_iso,
            # Supporting presentation fields
            "creator": {
                "id": str(doc.get("creator_id", "")),
                "name": doc.get("creator_name", "Creator"),
                "avatar": doc.get("creator_avatar", "/assets/anivex-avatar.png"),
                "verified": True,
            },
            "likes": int(doc.get("likes", 0)),
            "isLiked": bool(doc.get("isLiked", False)),
            "isBookmarked": bool(doc.get("isBookmarked", False)),
            "proposals": int(doc.get("proposals_count", 0)),
            "theme": doc.get("theme", "purple"),
            "image": doc.get("image") or (doc.get("files")[0]["url"] if doc.get("files") and isinstance(doc.get("files")[0], dict) and doc.get("files")[0].get("url") else "/assets/featured-1-web.png"),
            "timeAgo": "Recently",
            "experienceLevel": doc.get("experienceLevel", "Intermediate"),
        }

    @staticmethod
    def find_all(filter_query=None):
        query = filter_query or {}
        docs = list(projects_collection.find(query).sort("created_at", -1))
        return [ProjectModel.to_dict(d) for d in docs]

    @staticmethod
    def find_by_id(project_id):
        try:
            doc = projects_collection.find_one({"_id": ObjectId(project_id)})
            return ProjectModel.to_dict(doc)
        except Exception:
            return None

    @staticmethod
    def find_by_creator(creator_id):
        docs = list(projects_collection.find({"creator_id": str(creator_id)}).sort("created_at", -1))
        return [ProjectModel.to_dict(d) for d in docs]

    @staticmethod
    def create(data):
        now = datetime.utcnow()
        budget_val = data.get("budget")
        b_min = data.get("budgetMin", 0)
        b_max = data.get("budgetMax", 0)
        if not budget_val:
            if b_min and b_max:
                budget_val = f"${int(b_min):,} - ${int(b_max):,}"
            elif b_max:
                budget_val = f"${int(b_max):,}"
            else:
                budget_val = "Negotiable"

        project_doc = {
            "creator_id": str(data.get("creator_id", "")),
            "creator_name": data.get("creator_name", "Creator"),
            "creator_avatar": data.get("creator_avatar", "/assets/anivex-avatar.png"),
            "title": data.get("title", "").strip(),
            "category": data.get("category", "General"),
            "description": data.get("description", "").strip(),
            "budget": budget_val,
            "budgetMin": int(b_min or 0),
            "budgetMax": int(b_max or 0),
            "deadline": data.get("deadline", "Not specified"),
            "files": data.get("files", []),
            "status": "open",
            "created_at": now,
            "updated_at": now,
            "likes": 0,
            "proposals_count": 0,
            "isBookmarked": False,
            "theme": data.get("theme", "purple"),
            "experienceLevel": data.get("experienceLevel", "Intermediate"),
        }

        result = projects_collection.insert_one(project_doc)
        project_doc["_id"] = result.inserted_id
        return ProjectModel.to_dict(project_doc)
