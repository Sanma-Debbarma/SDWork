from database import db, projects_collection, users_collection
from datetime import datetime, timedelta

def seed_projects():
    count = projects_collection.count_documents({})
    if count > 0:
        print(f"projects collection already has {count} projects. Skipping seed.")
        return

    # Find or create sample creator user
    creator_user = users_collection.find_one({"role": "creator"})
    if not creator_user:
        creator_doc = {
            "email": "sarah.creator@edit.com",
            "name": "Sarah Jenkins",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
            "role": "creator",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        res = users_collection.insert_one(creator_doc)
        creator_user = creator_doc
        creator_user["_id"] = res.inserted_id

    creator_id = str(creator_user["_id"])

    initial_projects = [
        {
            "creator_id": creator_id,
            "creator_name": creator_user.get("name", "Sarah Jenkins"),
            "creator_avatar": creator_user.get("avatar", "/assets/anivex-avatar.png"),
            "title": "Modern SaaS Web Platform & Dashboard Design",
            "category": "Web Development",
            "description": "Looking for an experienced web designer and developer to redesign our SaaS analytics dashboard. Requires responsive views, interactive chart components, and clean UI.",
            "budget": "$2,500 - $4,500",
            "budgetMin": 2500,
            "budgetMax": 4500,
            "deadline": "2026-10-15",
            "files": [
                {"name": "dashboard_spec.pdf", "url": "/assets/featured-1-web.png"}
            ],
            "status": "open",
            "created_at": datetime.utcnow() - timedelta(days=2),
            "updated_at": datetime.utcnow() - timedelta(days=2),
            "likes": 24,
            "proposals_count": 5,
            "isBookmarked": False,
            "theme": "purple",
            "experienceLevel": "Expert",
        },
        {
            "creator_id": creator_id,
            "creator_name": "Marcus Vance",
            "creator_avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            "title": "YouTube Tech Review Video Editing & Sound Design",
            "category": "Video & Animation",
            "description": "Need a high-energy video editor for 4K tech review episodes (12-15 min length). Must have expertise in pacing, sound mixing, motion graphics callouts, and thumbnail concepts.",
            "budget": "$1,200 - $2,200",
            "budgetMin": 1200,
            "budgetMax": 2200,
            "deadline": "2026-09-30",
            "files": [
                {"name": "raw_footage_guide.pdf", "url": "/assets/featured-2-mobile.png"}
            ],
            "status": "open",
            "created_at": datetime.utcnow() - timedelta(days=1),
            "updated_at": datetime.utcnow() - timedelta(days=1),
            "likes": 19,
            "proposals_count": 8,
            "isBookmarked": False,
            "theme": "peach",
            "experienceLevel": "Intermediate",
        },
        {
            "creator_id": creator_id,
            "creator_name": "Elena Rostova",
            "creator_avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
            "title": "Brand Identity, Typography & 3D Visual System",
            "category": "3D & Modeling",
            "description": "Seeking a 3D designer and visual branding expert to create 3D abstract clay glass shapes and dynamic renders for our new fintech product launch.",
            "budget": "$3,000 - $5,500",
            "budgetMin": 3000,
            "budgetMax": 5500,
            "deadline": "2026-10-25",
            "files": [
                {"name": "brand_guidelines_brief.pdf", "url": "/assets/featured-3-ecommerce.png"}
            ],
            "status": "open",
            "created_at": datetime.utcnow() - timedelta(hours=8),
            "updated_at": datetime.utcnow() - timedelta(hours=8),
            "likes": 42,
            "proposals_count": 3,
            "isBookmarked": False,
            "theme": "mint",
            "experienceLevel": "Expert",
        },
        {
            "creator_id": creator_id,
            "creator_name": "David Kim",
            "creator_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "title": "Cross-Platform React Native Fitness App UI/UX",
            "category": "Mobile Development",
            "description": "Design system and high-fidelity screens for an iOS and Android health coaching mobile app. 25 screens with interactive prototypes in Figma.",
            "budget": "$2,800 - $4,000",
            "budgetMin": 2800,
            "budgetMax": 4000,
            "deadline": "2026-11-01",
            "files": [
                {"name": "user_flow_diagram.png", "url": "/assets/featured-4-brand.png"}
            ],
            "status": "open",
            "created_at": datetime.utcnow() - timedelta(hours=3),
            "updated_at": datetime.utcnow() - timedelta(hours=3),
            "likes": 31,
            "proposals_count": 6,
            "isBookmarked": False,
            "theme": "blue",
            "experienceLevel": "Expert",
        }
    ]

    projects_collection.insert_many(initial_projects)
    print(f"Successfully seeded {len(initial_projects)} projects into MongoDB projects collection!")

if __name__ == "__main__":
    seed_projects()
