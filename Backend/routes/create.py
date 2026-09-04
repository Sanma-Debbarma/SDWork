from flask import Blueprint, request, jsonify
from database import content_collection

create_bp = Blueprint("create", __name__)


# CREATE PROJECT
@create_bp.route("/api/content", methods=["POST"])
def create_content():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    content = {
        "user_id": data.get("user_id"),
        "title": data.get("title"),
        "category": data.get("category"),
        "budgetMin": data.get("budgetMin"),
        "budgetMax": data.get("budgetMax"),
        "description": data.get("description"),
        "status": "open"
    }

    if not content["title"]:
        return jsonify({"error": "Title is required"}), 400

    result = content_collection.insert_one(content)

    # Convert MongoDB ObjectId to string
    saved_content = {
        **content,
        "_id": str(result.inserted_id)
    }

    return jsonify({
        "message": "Project created successfully",
        "id": str(result.inserted_id),
        "project": saved_content
    }), 201


# GET ALL PROJECTS
@create_bp.route("/api/content", methods=["GET"])
def get_content():
    contents = list(content_collection.find())

    for content in contents:
        content["id"] = str(content.pop("_id"))

    return jsonify(contents), 200