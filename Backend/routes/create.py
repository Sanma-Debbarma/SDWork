from flask import Blueprint, request, jsonify
from database import projects_collection
from models.project import ProjectModel
from bson import ObjectId

create_bp = Blueprint("create", __name__)


# CREATE PROJECT (Alias for /api/projects)
@create_bp.route("/api/content", methods=["POST"])
def create_content():
    data = request.get_json(silent=True) or {}

    if not data or not data.get("title"):
        return jsonify({"error": "Title is required"}), 400

    project = ProjectModel.create(data)
    return jsonify({
        "message": "Project created successfully",
        "id": project["id"],
        "project": project
    }), 201


# GET ALL PROJECTS (Alias for /api/projects)
@create_bp.route("/api/content", methods=["GET"])
def get_content():
    projects = ProjectModel.find_all()
    return jsonify(projects), 200


@create_bp.route("/api/content/<id>/bookmark", methods=["PUT"])
def toggle_bookmark(id):
    try:
        content = projects_collection.find_one({"_id": ObjectId(id)})
        if not content:
            return jsonify({"error": "Project not found"}), 404

        new_bookmark_status = not content.get("isBookmarked", False)
        projects_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"isBookmarked": new_bookmark_status}}
        )

        return jsonify({
            "message": "Bookmark updated",
            "isBookmarked": new_bookmark_status
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400