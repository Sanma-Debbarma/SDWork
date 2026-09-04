from flask import Blueprint, request, jsonify
from database import content_collection

create_bp = Blueprint("create", __name__)


@create_bp.route("/api/content", methods=["POST"])
def create_content():

    data = request.get_json()

    content = {
        "user_id": data.get("user_id"),
        "title": data.get("title"),
        "description": data.get("description"),
        "category": data.get("category"),
        "budget": data.get("budget"),
        "status": "open"
    }

    result = content_collection.insert_one(content)

    return jsonify({
        "message": "Content created successfully",
        "id": str(result.inserted_id)
    }), 201


@create_bp.route("/api/content", methods=["GET"])
def get_content():

    contents = list(content_collection.find())

    for content in contents:
        content["_id"] = str(content["_id"])

    return jsonify(contents), 200