from flask import Blueprint, request, jsonify
from models import db
from models.content import Content

create_bp = Blueprint("create", __name__)


@create_bp.route("/api/content", methods=["POST"])
def create_content():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    title = data.get("title")
    description = data.get("description")
    category = data.get("category")
    budget = data.get("budget")
    user_id = data.get("user_id")

    if not title:
        return jsonify({
            "error": "Title is required"
        }), 400

    if not description:
        return jsonify({
            "error": "Description is required"
        }), 400

    if not category:
        return jsonify({
            "error": "Category is required"
        }), 400

    if budget is None:
        return jsonify({
            "error": "Budget is required"
        }), 400

    if user_id is None:
        return jsonify({
            "error": "User ID is required"
        }), 400

    content = Content(
        user_id=user_id,
        title=title,
        description=description,
        category=category,
        budget=budget
    )

    db.session.add(content)
    db.session.commit()

    return jsonify({
        "message": "Content created successfully",
        "content": content.to_dict()
    }), 201


# GET ALL CONTENT
@create_bp.route("/api/content", methods=["GET"])
def get_content():
    contents = Content.query.all()

    return jsonify([
        content.to_dict()
        for content in contents
    ]), 200