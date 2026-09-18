from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from routes.create import create_bp
from routes.projects import projects_bp
from routes.auth import auth_bp


app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "editcom-super-secret-jwt-key-2026")
CORS(app)

app.register_blueprint(create_bp)
app.register_blueprint(projects_bp)
app.register_blueprint(auth_bp)

FRONTEND_FOLDER = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../Frontend/dist")
)


@app.route("/")
def home():
    return send_from_directory(FRONTEND_FOLDER, "index.html")


@app.route("/<path:path>")
def serve_frontend(path):
    file_path = os.path.join(FRONTEND_FOLDER, path)

    if os.path.isfile(file_path):
        return send_from_directory(FRONTEND_FOLDER, path)

    return send_from_directory(FRONTEND_FOLDER, "index.html")


UPLOAD_FOLDER = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "uploads")
)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/api/uploads/<path:filename>")
@app.route("/uploads/<path:filename>")
def serve_uploads(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route("/api/hello")
def hello():
    return {
        "message": "Hello from Edit.com Backend!"
    }


if __name__ == "__main__":
    app.run(debug=True, port=5000)