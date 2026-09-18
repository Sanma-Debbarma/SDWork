import os
import random
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import jwt
from flask import Blueprint, request, jsonify
from database import otp_collection
from models.user import User

auth_bp = Blueprint("auth", __name__)

JWT_SECRET = os.getenv("JWT_SECRET_KEY", "editcom-super-secret-jwt-key-2026")
EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"


def is_valid_email(email: str) -> bool:
    if not email or not isinstance(email, str):
        return False
    return bool(re.match(EMAIL_REGEX, email.strip()))


def send_email_otp(to_email: str, otp_code: str) -> bool:
    """Send OTP via SMTP if credentials exist, otherwise log clearly to terminal."""
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    smtp_sender = os.getenv("SMTP_SENDER", smtp_user or "no-reply@edit.com")

    if smtp_host and smtp_user and smtp_pass:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"{otp_code} is your Edit.com verification code"
            msg["From"] = f"Edit.com <{smtp_sender}>"
            msg["To"] = to_email

            text_body = f"Your Edit.com verification code is: {otp_code}. This code expires in 10 minutes."
            html_body = f"""
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px; background: #ffffff;">
                <h2 style="color: #0f0f0f; margin: 0 0 12px 0;">Edit<span style="color: #7c3aed;">.com</span></h2>
                <p style="color: #4b5563; font-size: 15px; margin: 0 0 16px 0;">Use the verification code below to log in to your account:</p>
                <div style="background-color: #f3f4f6; border-radius: 8px; padding: 18px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827;">{otp_code}</span>
                </div>
                <p style="color: #6b7280; font-size: 13px; margin: 16px 0 0 0;">This code will expire in 10 minutes. If you did not request this, please disregard this email.</p>
            </div>
            """
            msg.attach(MIMEText(text_body, "plain"))
            msg.attach(MIMEText(html_body, "html"))

            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_sender, [to_email], msg.as_string())
            print(f"[OTP EMAIL] Successfully dispatched to {to_email}")
            return True
        except Exception as err:
            print(f"[OTP EMAIL ERROR] Could not dispatch email via SMTP ({err}). Falling back to terminal display.")
            return False
    else:
        print(f"[OTP NOTICE] SMTP not configured. OTP printed to terminal: {otp_code}")
        return False


def create_jwt_tokens(user_doc):
    now = datetime.utcnow()
    user_id = str(user_doc["_id"])
    email = user_doc["email"]

    access_payload = {
        "user_id": user_id,
        "email": email,
        "role": user_doc.get("role"),
        "exp": now + timedelta(days=7),
        "iat": now,
        "type": "access",
    }
    refresh_payload = {
        "user_id": user_id,
        "email": email,
        "role": user_doc.get("role"),
        "exp": now + timedelta(days=30),
        "iat": now,
        "type": "refresh",
    }

    access_token = jwt.encode(access_payload, JWT_SECRET, algorithm="HS256")
    refresh_token = jwt.encode(refresh_payload, JWT_SECRET, algorithm="HS256")
    return access_token, refresh_token


def get_token_from_header():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header.split(" ", 1)[1].strip()
    return None


# -------------------------------------------------------------
# 1. SEND OTP (Passwordless Login step 1)
# -------------------------------------------------------------
@auth_bp.route("/api/auth/send-otp", methods=["POST"])
@auth_bp.route("/send-otp", methods=["POST"])
@auth_bp.route("/login", methods=["POST"])  # Alias for compatibility
def send_otp():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Please enter a valid email address"}), 400

    # Generate 6-digit numeric OTP
    otp_code = f"{random.randint(100000, 999999)}"
    now = datetime.utcnow()
    expires_at = now + timedelta(minutes=10)

    # Save to MongoDB otps collection with expiration
    otp_collection.update_one(
        {"email": email},
        {
            "$set": {
                "email": email,
                "otp": otp_code,
                "created_at": now,
                "expires_at": expires_at,
                "attempts": 0,
                "verified": False,
            }
        },
        upsert=True,
    )

    # Dispatch email if SMTP configured, and print in terminal
    send_email_otp(email, otp_code)

    print(f"\n=======================================================")
    print(f"[OTP] Verification code for {email}: {otp_code}")
    print(f"=======================================================\n")

    return jsonify({
        "message": f"Verification code sent to {email}",
        "email": email,
        "dev_otp": otp_code,  # Provided for seamless local testing
    }), 200



# -------------------------------------------------------------
# 2. VERIFY OTP & LOGIN (Passwordless Login step 2)
# -------------------------------------------------------------
@auth_bp.route("/api/auth/verify-otp", methods=["POST"])
@auth_bp.route("/verify-otp", methods=["POST"])
@auth_bp.route("/verify", methods=["POST"])  # Alias for compatibility
def verify_otp():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    otp_input = str(data.get("otp", "")).strip()

    if not email or not otp_input:
        return jsonify({"error": "Both email and 6-digit verification code are required"}), 400

    if len(otp_input) != 6 or not otp_input.isdigit():
        return jsonify({"error": "Verification code must be a 6-digit number"}), 400

    # Look up OTP record
    record = otp_collection.find_one({"email": email})
    if not record:
        return jsonify({"error": "No verification code requested. Please request a new code."}), 400

    # Check expiration
    expires_at = record.get("expires_at")
    if isinstance(expires_at, datetime) and datetime.utcnow() > expires_at:
        return jsonify({"error": "Verification code has expired. Please request a new code."}), 400

    # Check attempt limit
    attempts = record.get("attempts", 0)
    if attempts >= 5:
        return jsonify({"error": "Too many failed attempts. Please request a new code."}), 400

    # Verify matching code
    if record.get("otp") != otp_input:
        otp_collection.update_one(
            {"_id": record["_id"]},
            {"$inc": {"attempts": 1}}
        )
        return jsonify({"error": "Invalid verification code. Please check and try again."}), 400

    # Clear used OTP
    otp_collection.delete_one({"_id": record["_id"]})

    # Find or auto-create User document
    user = User.find_by_email(email)
    if not user:
        user = User.create(email=email)

    access_token, refresh_token = create_jwt_tokens(user)

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "refresh_token": refresh_token,
        "user": User.to_dict(user),
    }), 200


# -------------------------------------------------------------
# 3. RESEND OTP
# -------------------------------------------------------------
@auth_bp.route("/api/auth/resend-otp", methods=["POST"])
@auth_bp.route("/resend-otp", methods=["POST"])
def resend_otp():
    return send_otp()


# -------------------------------------------------------------
# 4. GOOGLE LOGIN / CALLBACK
# -------------------------------------------------------------
@auth_bp.route("/api/auth/google", methods=["POST"])
@auth_bp.route("/api/auth/google_login", methods=["POST"])
@auth_bp.route("/google_login", methods=["POST"])
@auth_bp.route("/google_callback", methods=["POST"])
def google_login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    name = data.get("name")
    avatar = data.get("avatar")
    google_id = data.get("google_id")

    # If demo/fallback or no specific email provided:
    if not email:
        email = "google.user@edit.com"
        name = name or "Google User"
        avatar = avatar or "/assets/anivex-avatar.png"

    user = User.find_by_email(email)
    if not user:
        user = User.create(
            email=email,
            name=name,
            avatar=avatar,
            google_id=google_id
        )
    else:
        # Update user profile with latest google data if provided
        update_data = {}
        if name and not user.get("name"):
            update_data["name"] = name
        if avatar and not user.get("avatar"):
            update_data["avatar"] = avatar
        if google_id and not user.get("google_id"):
            update_data["google_id"] = google_id
        if update_data:
            user = User.update(user["_id"], update_data) or user

    access_token, refresh_token = create_jwt_tokens(user)

    return jsonify({
        "message": "Google login successful",
        "token": access_token,
        "refresh_token": refresh_token,
        "user": User.to_dict(user),
    }), 200


# -------------------------------------------------------------
# 5. CURRENT USER (GET /api/auth/me)
# -------------------------------------------------------------
@auth_bp.route("/api/auth/me", methods=["GET"])
@auth_bp.route("/me", methods=["GET"])
def get_current_user():
    token = get_token_from_header()
    if not token:
        return jsonify({"error": "Authorization token is missing"}), 401

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id")
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "user": User.to_dict(user)
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except Exception:
        return jsonify({"error": "Invalid token"}), 401


# -------------------------------------------------------------
# 6. TOKEN REFRESH
# -------------------------------------------------------------
@auth_bp.route("/api/auth/refresh", methods=["POST"])
@auth_bp.route("/refresh", methods=["POST"])
def refresh_token():
    data = request.get_json(silent=True) or {}
    r_token = data.get("refresh_token") or get_token_from_header()

    if not r_token:
        return jsonify({"error": "Refresh token is required"}), 400

    try:
        payload = jwt.decode(r_token, JWT_SECRET, algorithms=["HS256"])
        if payload.get("type") != "refresh":
            return jsonify({"error": "Invalid token type"}), 400

        user_id = payload.get("user_id")
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        access_token, new_refresh = create_jwt_tokens(user)
        return jsonify({
            "token": access_token,
            "refresh_token": new_refresh,
            "user": User.to_dict(user)
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Refresh token has expired"}), 401
    except Exception:
        return jsonify({"error": "Invalid refresh token"}), 401


# -------------------------------------------------------------
# 7. LOGOUT
# -------------------------------------------------------------
@auth_bp.route("/api/auth/logout", methods=["POST"])
@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200


# -------------------------------------------------------------
# 8. SELECT / UPDATE ROLE
# -------------------------------------------------------------
@auth_bp.route("/api/auth/role", methods=["POST", "PUT"])
@auth_bp.route("/api/auth/select-role", methods=["POST"])
def select_role():
    token = get_token_from_header()
    if not token:
        return jsonify({"error": "Authorization token is missing"}), 401

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id")
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json(silent=True) or {}
        role = data.get("role", "").strip().lower()

        if role not in ["editor", "creator"]:
            return jsonify({"error": "Invalid role. Role must be 'editor' or 'creator'"}), 400

        updated_user = User.set_role(user_id, role)
        if not updated_user:
            return jsonify({"error": "Failed to update role"}), 500

        # Generate fresh tokens containing the new role
        access_token, refresh_token = create_jwt_tokens(updated_user)

        return jsonify({
            "message": f"Role successfully set to {role}",
            "role": role,
            "token": access_token,
            "refresh_token": refresh_token,
            "user": User.to_dict(updated_user),
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except Exception as e:
        return jsonify({"error": f"Invalid token or request: {str(e)}"}), 401