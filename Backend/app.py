from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from routes.create import create_bp
from models import db


app = Flask(__name__)
CORS(app)


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///edit.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
app.register_blueprint(create_bp)

with app.app_context():
    db.create_all()


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


@app.route("/api/hello")
def hello():
    return {
        "message": "Hello from Edit.com Backend!"
    }


if __name__ == "__main__":
    app.run(debug=True, port=5000)