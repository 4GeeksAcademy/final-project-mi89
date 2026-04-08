import os
import cloudinary
import cloudinary.uploader
from flask import Flask, request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User, Photo, Like, Comment, CustomerPoints

api = Blueprint('api', __name__)

# ── Cloudinary config ─────────────────────────────────────────────────────────
# El SDK lee CLOUDINARY_URL del .env automáticamente
# Formato: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
import cloudinary
cloudinary.config(secure=True)   # lee CLOUDINARY_URL solo


# ── JADEN's original endpoints (sin tocar) ────────────────────────────────────

@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({"message": "Hello! I'm a message that came from the backend"}), 200


@api.route('/token', methods=['POST'])
def create_token():
    email    = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password_hash(password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user_id": user.id, "user_type": user.user_type}), 200


@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.serialize() for u in users]), 200


@api.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user.serialize()), 200


@api.route('/login', methods=['POST'])
def login():
    email    = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password_hash(password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user": user.serialize()}), 200


@api.route('/signup', methods=['POST'])
def signup():
    email     = request.json.get("email")
    password  = request.json.get("password")
    user_type = request.json.get("user_type", "customer")

    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already registered"}), 409

    new_user           = User()
    new_user.email     = email
    new_user.password  = password   # setter runs generate_password_hash
    new_user.user_type = user_type
    new_user.is_active = True

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({"token": access_token, "user": new_user.serialize()}), 201


# ── PHOTO ENDPOINTS ───────────────────────────────────────────────────────────

@api.route('/photo/upload', methods=['POST'])
def upload_photo():
    """Recibe multipart/form-data con: photo (file), dish_name, category, restaurant_id"""
    if 'photo' not in request.files:
        return jsonify({"msg": "No photo file"}), 400

    file          = request.files['photo']
    dish_name     = request.form.get("dish_name", "Unknown Dish")
    category      = request.form.get("category", "entree")
    restaurant_id = request.form.get("restaurant_id", 1)

    # Subir a Cloudinary
    result = cloudinary.uploader.upload(file, folder="tablesnap")

    # Guardar en DB
    photo               = Photo()
    photo.cloudinary_url = result["secure_url"]
    photo.cloudinary_id  = result["public_id"]
    photo.dish_name      = dish_name
    photo.category       = category
    photo.restaurant_id  = int(restaurant_id)

    # Si viene JWT, guardamos el customer_id
    try:
        from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        if user_id:
            photo.customer_id = int(user_id)
    except Exception:
        pass

    db.session.add(photo)

    # Dar 10 puntos al cliente (si está autenticado)
    if photo.customer_id and photo.restaurant_id:
        cp = CustomerPoints.query.filter_by(
            customer_id=photo.customer_id,
            restaurant_id=photo.restaurant_id
        ).first()
        if not cp:
            cp = CustomerPoints(customer_id=photo.customer_id, restaurant_id=photo.restaurant_id, points=0)
            db.session.add(cp)
        cp.points += 10

    db.session.commit()
    return jsonify({"msg": "Photo uploaded!", "photo": photo.serialize()}), 201


@api.route('/photos', methods=['GET'])
def get_all_photos():
    photos = Photo.query.order_by(Photo.created_at.desc()).limit(50).all()
    return jsonify([p.serialize() for p in photos]), 200


@api.route('/restaurant/<int:restaurant_id>/photos', methods=['GET'])
def get_restaurant_photos(restaurant_id):
    photos = Photo.query.filter_by(restaurant_id=restaurant_id)\
                        .order_by(Photo.created_at.desc()).all()
    return jsonify([p.serialize() for p in photos]), 200


# ── LIKES ─────────────────────────────────────────────────────────────────────

@api.route('/photo/<int:photo_id>/like', methods=['POST'])
def toggle_like(photo_id):
    """Toggle like. Body opcional: { customer_id }"""
    customer_id = request.json.get("customer_id") if request.is_json else None

    photo = Photo.query.get_or_404(photo_id)

    if customer_id:
        existing = Like.query.filter_by(photo_id=photo_id, customer_id=customer_id).first()
        if existing:
            db.session.delete(existing)
            db.session.commit()
            return jsonify({"liked": False, "total_likes": len(photo.likes)}), 200

    new_like             = Like()
    new_like.photo_id    = photo_id
    new_like.customer_id = customer_id
    db.session.add(new_like)

    # 2 puntos extra al subidor de la foto
    if photo.customer_id and photo.restaurant_id:
        cp = CustomerPoints.query.filter_by(
            customer_id=photo.customer_id,
            restaurant_id=photo.restaurant_id
        ).first()
        if not cp:
            cp = CustomerPoints(customer_id=photo.customer_id, restaurant_id=photo.restaurant_id, points=0)
            db.session.add(cp)
        cp.points += 2

    db.session.commit()
    return jsonify({"liked": True, "total_likes": len(photo.likes)}), 200


# ── COMMENTS ─────────────────────────────────────────────────────────────────

@api.route('/photo/<int:photo_id>/comments', methods=['GET'])
def get_comments(photo_id):
    comments = Comment.query.filter_by(photo_id=photo_id)\
                            .order_by(Comment.created_at.desc()).all()
    return jsonify([c.serialize() for c in comments]), 200


@api.route('/photo/<int:photo_id>/comments', methods=['POST'])
def add_comment(photo_id):
    text        = request.json.get("text")
    customer_id = request.json.get("customer_id")

    if not text:
        return jsonify({"msg": "Comment text required"}), 400

    comment             = Comment()
    comment.photo_id    = photo_id
    comment.text        = text
    comment.customer_id = customer_id

    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.serialize()), 201


# ── LEADERBOARD ───────────────────────────────────────────────────────────────

@api.route('/leaderboard', methods=['GET'])
def leaderboard():
    """Top restaurantes por número de fotos subidas"""
    restaurants = User.query.filter_by(user_type="owner").all()
    data = []
    for r in restaurants:
        photo_count = Photo.query.filter_by(restaurant_id=r.id).count()
        total_likes = sum(len(p.likes) for p in r.restaurant_photos)
        data.append({
            "restaurant_id":    r.id,
            "restaurant_email": r.email,
            "photo_count":      photo_count,
            "total_likes":      total_likes,
            "score":            photo_count * 10 + total_likes * 2,
        })
    data.sort(key=lambda x: x["score"], reverse=True)
    return jsonify(data), 200


# ── CUSTOMER POINTS ───────────────────────────────────────────────────────────

@api.route('/customer/<int:customer_id>/points', methods=['GET'])
def get_customer_points(customer_id):
    points = CustomerPoints.query.filter_by(customer_id=customer_id).all()
    return jsonify([p.serialize() for p in points]), 200