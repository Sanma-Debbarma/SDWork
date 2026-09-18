import requests
import json
from app import app

# Use Flask test client for fast, direct in-memory testing
client = app.test_client()

print("--- TEST 1: Send OTP ---")
test_email = "newuser.test@edit.com"
res = client.post("/api/auth/send-otp", json={"email": test_email})
print("Status:", res.status_code)
data = res.get_json()
print("Response:", data)
assert res.status_code == 200, f"Expected 200, got {res.status_code}"
assert "dev_otp" in data, "dev_otp missing from response"
otp_code = data["dev_otp"]

print("\n--- TEST 2: Verify OTP with Incorrect Code ---")
res_wrong = client.post("/api/auth/verify-otp", json={"email": test_email, "otp": "000000"})
print("Status:", res_wrong.status_code, "Response:", res_wrong.get_json())
assert res_wrong.status_code == 400

print("\n--- TEST 3: Verify OTP with Correct Code (New User without role) ---")
res_valid = client.post("/api/auth/verify-otp", json={"email": test_email, "otp": otp_code})
print("Status:", res_valid.status_code)
auth_data = res_valid.get_json()
print("Auth Response user:", auth_data.get("user"))
assert res_valid.status_code == 200
assert "token" in auth_data
token = auth_data["token"]

print("\n--- TEST 4: Select Role as Creator ---")
res_role = client.post("/api/auth/role", json={"role": "creator"}, headers={"Authorization": f"Bearer {token}"})
print("Status:", res_role.status_code, "Response:", res_role.get_json())
assert res_role.status_code == 200
creator_token = res_role.get_json()["token"]
user_role = res_role.get_json()["user"]["role"]
assert user_role == "creator", f"Expected creator, got {user_role}"

print("\n--- TEST 5: Creator Creates Project in MongoDB ---")
project_payload = {
    "title": "Full-Stack AI Video Generation App",
    "category": "Web Development",
    "description": "Need an expert to build Next.js frontend and Python FastAPI pipeline.",
    "budget": "$3,500 - $6,000",
    "budgetMin": 3500,
    "budgetMax": 6000,
    "deadline": "2026-11-15",
    "files": [{"name": "spec.pdf", "url": "/assets/featured-1-web.png"}]
}
res_proj = client.post("/api/projects", json=project_payload, headers={"Authorization": f"Bearer {creator_token}"})
print("Create Project Status:", res_proj.status_code, "Response:", res_proj.get_json())
assert res_proj.status_code == 201
new_project_id = res_proj.get_json()["id"]

print("\n--- TEST 6: Browse Projects from MongoDB ---")
res_list = client.get("/api/projects")
print("Projects list status:", res_list.status_code)
projects = res_list.get_json()
assert res_list.status_code == 200
assert len(projects) > 0, "No projects returned from MongoDB"
print(f"Total projects in MongoDB: {len(projects)}")
matching = [p for p in projects if p["id"] == new_project_id]
assert len(matching) == 1, "Created project not found in MongoDB projects feed"
print("Found newly created project:", matching[0]["title"], "Creator ID:", matching[0]["creator_id"])

print("\n--- TEST 7: Select Role as Editor & Verify Creation is Blocked ---")
res_editor_role = client.post("/api/auth/role", json={"role": "editor"}, headers={"Authorization": f"Bearer {creator_token}"})
editor_token = res_editor_role.get_json()["token"]
res_blocked = client.post("/api/projects", json=project_payload, headers={"Authorization": f"Bearer {editor_token}"})
print("Editor Create Project Status (expecting 403):", res_blocked.status_code)
assert res_blocked.status_code == 403, f"Expected 403 Forbidden for editor creating project, got {res_blocked.status_code}"

print("\nALL BACKEND AUTH & ROLE TESTS PASSED SUCCESSFULLY!")
