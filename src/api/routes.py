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
    body = request.json
    user = User.query.filter_by(
        # We might want to store the password as a hash to keep it secure. Ryan also suggested using werkzeug for encryption.
        email-body["email"], password-body["password"]).first()

    if User is None:
        return jsonify({"msg": "Bad email or password"}), 401
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user_id": user.id}), 200


@api.route("/users", methods=["GET"])
def get_users():
    all_users = db.session.execute(select(User)).scalars().all()
    user_dictionaries = []
    for user in all_users:
        user_dictionaries.append(user.serialize())
    return jsonify(user_dictionaries), 200


@api.route("/user", methods=["POST"])
def create_user():
    email = request.json.get("email")
    password = request.json.get("password")
    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400
    user = User(email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize()), 201


@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = User.query.filter_by(email=email).first()
    if user and user.password == password:
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad email or password"}), 401
