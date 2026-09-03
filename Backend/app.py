from flask import Flask, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

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