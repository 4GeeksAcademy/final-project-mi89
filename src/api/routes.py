"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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
    user_type = request.json.get("user_type", None)
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
