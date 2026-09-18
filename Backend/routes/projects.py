from flask import Blueprint, request, jsonify
from database import content_collection, projects_collection
from models.project import ProjectModel
from models.user import User
from bson import ObjectId
import os
from datetime import datetime
import jwt

projects_bp = Blueprint("projects", __name__)

JWT_SECRET = os.getenv("JWT_SECRET_KEY", "editcom-super-secret-jwt-key-2026")

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "uploads"
)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def get_current_user_from_token():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1].strip()
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            user_id = payload.get("user_id")
            return User.find_by_id(user_id)
        except Exception:
            return None
    return None


# ==========================================
# 1. GET ALL PROJECTS (Editor browse / Public)
# ==========================================
@projects_bp.route("/api/projects", methods=["GET"])
def get_all_projects():
    try:
        category = request.args.get("category")
        query = {}
        if category and category != "All Categories":
            query["category"] = category

        projects = ProjectModel.find_all(query)
        return jsonify(projects), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================================
# 2. GET SINGLE PROJECT
# ==========================================
@projects_bp.route("/api/projects/<project_id>", methods=["GET"])
def get_single_project(project_id):
    project = ProjectModel.find_by_id(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    return jsonify(project), 200


# ==========================================
# 3. CREATE PROJECT (Creator only)
# ==========================================
@projects_bp.route("/api/projects", methods=["POST"])
def create_project():
    data = request.get_json(silent=True) or {}
    user = get_current_user_from_token()

    # If authenticated, enforce role restriction
    if user:
        if user.get("role") == "editor":
            return jsonify({
                "error": "Editors are not permitted to create projects. Only Creators can create projects."
            }), 403
        creator_id = str(user["_id"])
        creator_name = user.get("name") or user.get("email", "").split("@")[0].capitalize()
        creator_avatar = user.get("avatar") or "/assets/anivex-avatar.png"
    else:
        # Fallback if unauthenticated in dev
        creator_id = str(data.get("creator_id") or data.get("user_id") or "creator-demo")
        creator_name = data.get("creator_name", "Creator")
        creator_avatar = data.get("creator_avatar", "/assets/anivex-avatar.png")

    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "Project title is required"}), 400

    category = data.get("category", "Web Development")
    description = data.get("description", "").strip()
    budget = data.get("budget", "")
    budget_min = data.get("budgetMin", 0)
    budget_max = data.get("budgetMax", 0)
    deadline = data.get("deadline", "Flexible")
    files = data.get("files", [])
    theme = data.get("theme", "purple")

    project_payload = {
        "creator_id": creator_id,
        "creator_name": creator_name,
        "creator_avatar": creator_avatar,
        "title": title,
        "category": category,
        "description": description,
        "budget": budget,
        "budgetMin": budget_min,
        "budgetMax": budget_max,
        "deadline": deadline,
        "files": files,
        "theme": theme,
    }

    try:
        created_project = ProjectModel.create(project_payload)
        return jsonify({
            "message": "Project published successfully",
            "project": created_project,
            "id": created_project["id"],
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================================
# 4. TOGGLE BOOKMARK ON PROJECT
# ==========================================
@projects_bp.route("/api/projects/<project_id>/bookmark", methods=["PUT"])
def toggle_project_bookmark(project_id):
    try:
        doc = projects_collection.find_one({"_id": ObjectId(project_id)})
        if not doc:
            return jsonify({"error": "Project not found"}), 404

        new_status = not doc.get("isBookmarked", False)
        projects_collection.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"isBookmarked": new_status}}
        )
        return jsonify({
            "message": "Bookmark updated",
            "isBookmarked": new_status
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ==========================================
# 5. UPLOAD ATTACHMENT FOR PROJECT BRIEF
# ==========================================
@projects_bp.route("/api/projects/upload-attachment", methods=["POST"])
def upload_attachment():
    try:
        file = request.files.get("file")
        if not file or not file.filename:
            return jsonify({"error": "File is required"}), 400

        # Safe unique filename
        filename = f"{int(datetime.utcnow().timestamp())}_{file.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        file_url = f"/api/uploads/{filename}"
        return jsonify({
            "message": "File uploaded successfully",
            "filename": file.filename,
            "saved_filename": filename,
            "url": file_url,
            "size": os.path.getsize(file_path),
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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