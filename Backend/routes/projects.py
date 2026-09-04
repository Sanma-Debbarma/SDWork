from flask import Blueprint, request, jsonify
from database import content_collection
from bson import ObjectId
import os

projects_bp = Blueprint("projects", __name__)

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "uploads"
)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ==========================================
# GET MY WORKING PROJECTS
# ==========================================
@projects_bp.route("/api/projects/my/<user_id>", methods=["GET"])
def get_my_projects(user_id):
    try:
        user_id = int(user_id)

        projects = list(
            content_collection.find({
                "assignedTo": user_id
            })
        )

        result = []

        for project in projects:
            result.append({
                "id": str(project["_id"]),
                "title": project.get("title", ""),
                "category": project.get("category", "Other"),

                "client": project.get("client", "Client"),
                "clientAvatar": project.get(
                    "clientAvatar",
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                ),

                "status": project.get(
                    "workStatus",
                    "in_progress"
                ),

                "progress": project.get("progress", 0),

                "deadline": project.get(
                    "deadline",
                    "Deadline not set"
                ),

                "budgetMin": project.get("budgetMin", 0),
                "budgetMax": project.get("budgetMax", 0),

                "budget": project.get(
                    "budget",
                    f"${project.get('budgetMin', 0):,} - ${project.get('budgetMax', 0):,}"
                )
            })

        return jsonify(result), 200

    except ValueError:
        return jsonify({
            "error": "Invalid user ID"
        }), 400

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

@projects_bp.route("/api/projects/test-assign", methods=["GET"])
def test_assign():
    project_id = "6a9adc872a17431d46fc835e"

    result = content_collection.update_one(
        {"_id": ObjectId(project_id)},
        {
            "$set": {
                "assignedTo": 1,
                "workStatus": "in_progress",
                "progress": 0
            }
        }
    )

    if result.matched_count == 0:
        return jsonify({"error": "Project not found"}), 404

    return jsonify({
        "message": "Project assigned successfully",
        "assignedTo": 1
    }), 200
# ==========================================
# ASSIGN PROJECT TO FREELANCER
# ==========================================
@projects_bp.route("/api/projects/<project_id>/assign", methods=["PUT"])
def assign_project(project_id):
    data = request.get_json()

    if not data or "user_id" not in data:
        return jsonify({
            "error": "user_id is required"
        }), 400

    try:
        user_id = int(data["user_id"])

        result = content_collection.update_one(
            {
                "_id": ObjectId(project_id)
            },
            {
                "$set": {
                    "assignedTo": user_id,
                    "workStatus": "in_progress",
                    "progress": 0
                }
            }
        )

        if result.matched_count == 0:
            return jsonify({
                "error": "Project not found"
            }), 404

        return jsonify({
            "message": "Project assigned successfully",
            "assignedTo": user_id
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


# ==========================================
# UPDATE PROJECT STATUS / PROGRESS
# ==========================================
@projects_bp.route("/api/projects/<project_id>/progress", methods=["PUT"])
def update_project_progress(project_id):
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    try:
        update_data = {}

        if "workStatus" in data:
            update_data["workStatus"] = data["workStatus"]

        if "progress" in data:
            update_data["progress"] = int(data["progress"])

        if not update_data:
            return jsonify({
                "error": "Nothing to update"
            }), 400

        result = content_collection.update_one(
            {
                "_id": ObjectId(project_id)
            },
            {
                "$set": update_data
            }
        )

        if result.matched_count == 0:
            return jsonify({
                "error": "Project not found"
            }), 404

        return jsonify({
            "message": "Project updated successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400

# ==========================================
# UPLOAD WORK
# ==========================================
@projects_bp.route("/api/projects/upload", methods=["POST"])
def upload_work():
    try:
        print("========== UPLOAD START ==========")

        file = request.files.get("file")
        project_id = request.form.get("project_id")

        print("Project ID:", project_id)
        print("File:", file)

        if not file:
            return jsonify({
                "error": "File is required"
            }), 400

        if not project_id:
            return jsonify({
                "error": "project_id is required"
            }), 400

        # Check project ID
        try:
            object_id = ObjectId(project_id)
        except Exception:
            return jsonify({
                "error": "Invalid project ID"
            }), 400

        project = content_collection.find_one({
            "_id": object_id
        })

        if not project:
            return jsonify({
                "error": "Project not found"
            }), 404

        if not file.filename:
            return jsonify({
                "error": "Invalid filename"
            }), 400

        filename = file.filename

        print("Filename:", filename)
        print("Upload folder:", UPLOAD_FOLDER)

        # Save file
        file_path = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        file.save(file_path)

        print("File saved:", file_path)

        # Update MongoDB
        result = content_collection.update_one(
            {"_id": object_id},
            {
                "$set": {
                    "workStatus": "review",
                    "progress": 100,
                    "deliverable": filename
                }
            }
        )

        print("MongoDB modified:", result.modified_count)

        print("========== UPLOAD SUCCESS ==========")

        return jsonify({
            "message": "Work uploaded successfully",
            "filename": filename,
            "status": "review",
            "progress": 100
        }), 200

    except Exception as e:
        print("========== UPLOAD ERROR ==========")
        print(type(e).__name__)
        print(str(e))
        print("===================================")

        return jsonify({
            "error": str(e)
        }), 500