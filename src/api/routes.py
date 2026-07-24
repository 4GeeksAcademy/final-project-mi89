"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Customer, Owner, Photo, Like, Comment, Point
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import cloudinary
import cloudinary.uploader
cloudinary.config(secure=True)

api = Blueprint('api', __name__)

# Allow CORS requests to this API

CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Query your database for email and password
    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        # The user was not found on the database
        return jsonify({"msg": "Bad email or password"}), 401

    # Create a new token with the user id inside
    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user_id": user.id}), 201


@api.route("/users", methods=["GET"])
def get_users():
    all_users = db.session.execute(select(User)).scalars().all()
    user_dictionaries = []
    for user in all_users:
        user_dictionaries.append(user.serialize())
    return jsonify(user_dictionaries), 200


@api.route("/user", methods=["GET"])
@jwt_required()
def get_user(): 
    user = db.get_or_404(User, int(get_jwt_identity()))
    current_user = db.session.get(User, user.id)
    return jsonify(current_user.serialize()), 200

@api.route("/user/<int:user_id>", methods=["GET"])
@jwt_required()
def get_specfic_user(user_id):
    current_user = db.session.get(User, user_id)
    return jsonify(current_user.serialize()), 200  # ✅ FIXED


@api.route("/user", methods=["POST"])
def create_user():
    user_type = request.json.get("user_type")
    email = request.json.get("email")
    password = request.json.get("password")
    if not user_type or not email or not password:
        return jsonify({"msg": "Missing user type (customer/owner), email, or password"}), 400
    user = User(user_type=user_type, email=email,
                password=password, is_active=True)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize()), 201


@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify(msg="Invalid username or password"), 401

    if not user.check_password_hash(password):
        return jsonify(msg="Invalid username or password"), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200


@api.route("/signup", methods=["POST"])
def signup():
    print("DEBUG request.json:", request.json, flush=True)
    user_type = request.json.get("user_type")
    email = request.json.get("email")
    password = request.json.get("password")

    if not user_type or not email or not password:
        return jsonify({"msg": "Missing user_type, email, or password"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"msg": "User already exists"}), 400

    user = User(
        user_type=user_type,
        email=email,
        password=password,
        is_active=True
    )
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({
        "access_token": access_token,
        "user": user.serialize()
    }), 201


@api.route("/customer", methods=["POST"])
def new_customer():
    user_id = request.json.get("user_id")
    username = request.json.get("username")

    customer = Customer(
        user_id=user_id,
        username=username,
    )
    db.session.add(customer)
    db.session.commit()

    return jsonify({
        "user_id": user_id,
        "customer": customer.serialize()
    })


@api.route("/owner", methods=["POST"])
def new_owner():
    user_id = request.json.get("user_id")
    username = request.json.get("username")

    owner = Owner(
        user_id=user_id,
        username=username,
    )
    db.session.add(owner)
    db.session.commit()

    return jsonify({
        "user_id": user_id,
        "owner": owner.serialize()
    })


@api.route("/photo", methods=["POST"])
@jwt_required()
def post_photo(photo_id):
    current_customer_id = get_jwt_identity()
    if current_customer_id is None:
        return jsonify({"message": "Invalid or missing customer id."}), 400
    customer = db.session.get(Customer, current_customer_id)
    photo = db.session.get(Photo, photo_id)
    if customer is None or photo is None:
        return jsonify({"message": "Invalid customer id or photo id"}), 404
    photo = Photo(
        customer_id=customer.id,)
    db.session.add(photo)

    db.session.commit()
    seralized_customer = customer.serialize()
    return jsonify(seralized_customer), 201


@api.route("/like/<int:photo_id>", methods=["POST"])
def like_photo(photo_id):
    current_user_id = get_jwt_identity()
    if current_user_id is None:
        return jsonify({"message": "Invalid or missing user id."}), 400

    user = db.session.get(User, current_user_id)
    photo = db.session.get(Photo, photo_id)
    if not user or not photo:
        return jsonify({"message": "Invalid user or photo"}), 404

    like = request.json.get("like")
    if user is None or like is None:
        return jsonify({"message": "Invalid user id or missing like"}), 404
    new_like = Like(
        photo_id=photo.id, customer_id=user.id)
    db.session.add(new_like)
    db.session.commit()
    return jsonify({"message": "Like added successfully"}), 201


@api.route("/comment/<int:photo_id>", methods=["POST"])
def comment_on_photo(photo_id):
    current_user_id = get_jwt_identity()
    if current_user_id is None:
        return jsonify({"message": "Invalid or missing user id."}), 400

    user = db.session.get(User, current_user_id)
    photo = db.session.get(Photo, photo_id)
    if not user or not photo:
        return jsonify({"message": "Invalid user or photo"}), 404

    comment = request.json.get("comment")
    if user is None or comment is None:
        return jsonify({"message": "Invalid user id, or comment is blank"}), 404
    new_comment = Comment(
        photo_id=photo.id, customer_id=user.id, comment=comment)
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({"message": "Comment added successfully"}), 201


@api.route("/point", methods=["POST"])
@jwt_required()
def add_point():
    current_user_id = get_jwt_identity()
    if current_user_id is None:
        return jsonify({"message": "Invalid or missing user id."}), 400

    user = db.session.get(User, current_user_id)
    if not user or not user.user_type != "customer":
        return jsonify({"message": "Invalid user or user is not a customer."}), 403

    customer = db.session.query(Customer).filter_by(user_id=user.id).first()
    if not customer:
        return jsonify({"message": "Customer not found"}), 404

    new_point = Point(customer_id=customer.id)
    db.session.add(new_point)
    db.session.commit()

    return jsonify(customer.serialize()), 201


@api.route('/photo/upload', methods=['POST'])
@jwt_required()
def upload_photo():
    """Recibe multipart/form-data con: photo (file), dish_name, category, restaurant_id"""
    if 'photo' not in request.files:
        return jsonify({"msg": "No photo file"}), 400

    file = request.files['photo']
    dish_name = request.form.get("dish_name", "Unknown Dish")
    category = request.form.get("category", "entree")
    # restaurant_id = request.form.get("restaurant_id", 1) # Use this after we've added more restaurants
    restaurant_id = 1 # Hard coded since there's only 1 restaurant

    # Subir a Cloudinary
    result = cloudinary.uploader.upload(file, folder="tablesnap")
    print(get_jwt_identity())
    user = db.get_or_404(User, int(get_jwt_identity()))

    # Guardar en DB
    photo = Photo()
    photo.cloudinary_url = result["secure_url"]
    photo.cloudinary_id = result["public_id"]
    photo.dish_name = dish_name
    photo.category = category
    photo.restaurant_id = int(restaurant_id)
    photo.customer = user.customer
    # Si viene JWT, guardamos el customer_id

    db.session.add(photo)

    # Dar 10 puntos al cliente (si está autenticado)
    if photo.customer_id and photo.restaurant_id:
        cp = Point.query.filter_by(
            customer_id=photo.customer_id,
            restaurant_id=photo.restaurant_id
        ).first()
        if not cp:
            cp = Point(customer_id=photo.customer_id,
                       restaurant_id=photo.restaurant_id, points=0)
            db.session.add(cp)
        cp.points += 10

    db.session.commit()
    return jsonify({"msg": "Photo uploaded!", "photo": photo.serialize()}), 201


@api.route('/photos', methods=['GET'])
def get_all_photos():
    photos = Photo.query.order_by(Photo.created_at.desc()).limit(50).all()
    return jsonify([p.serialize() for p in photos]), 200


# @api.route("/restaurant", methods=["POST"])
# @jwt_required()
# def add_restaurant(restaurant_id):
#     current_owner_id = get_jwt_identity()
#     if current_owner_id is None:
#         return jsonify({"message": "Invalid or missing owner id."}), 400
#     owner = db.session.get(Owner, current_owner_id)
#     restaurant = db.session.get(Restaurant, restaurant_id)
#     if owner is None or restaurant is None:
#         return jsonify({"message": "Invalid owner id or restaurant id"}), 404
#     restaurant = Restaurant(
#         owner_id=owner.id, restaurant=restaurant.id)
#     db.session.add(restaurant)

#     db.session.commit()
#     serialized_owner = owner.serialize()
#     return jsonify(serialized_owner), 201
