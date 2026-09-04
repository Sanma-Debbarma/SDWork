from flask import Blueprint, jsonify, request

projects_bp = Blueprint(
    "projects",
    __name__,
    url_prefix="/api/projects"
)


@projects_bp.route("/", methods=["POST"])
def create_project():

    data = request.get_json()

    title = data.get("title")
    description = data.get("description")
    budget = data.get("budget")

    return jsonify({
        "message": "Project created successfully!",
        "project": {
            "title": title,
            "description": description,
            "budget": budget
        }
    }), 201