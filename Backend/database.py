from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

db = client["edit_db"]

content_collection = db["content"]
users_collection = db["users"]
otp_collection = db["otps"]
projects_collection = db["projects"]

try:
    client.admin.command("ping")
    print("MongoDB connected successfully!")
    # Create indexes safely
    users_collection.create_index("email", unique=True, sparse=True)
    otp_collection.create_index("email")
    otp_collection.create_index("expires_at", expireAfterSeconds=0)
    projects_collection.create_index("creator_id")
    projects_collection.create_index("created_at")
except Exception as e:
    print("MongoDB connection failed or index warning:", e)