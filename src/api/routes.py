from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Photo
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import uuid
import os

api = Blueprint('api', __name__)
CORS(api)

# Carpeta donde se guardan las fotos
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../../public/uploads')


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({"message": "Hello! I'm a message that came from the backend"}), 200


@api.route('/upload', methods=['POST'])
def upload_photos():
    files = request.files.getlist('fotos')
    mode = request.form.get('modo', 'usuario')
    category = request.form.get('categoria')
    caption = request.form.get('caption')

    if not files or files[0].filename == '':
        return jsonify({"error": "No se recibieron fotos"}), 400

    saved = []
    for f in files:
        ext = f.filename.rsplit('.', 1)[-1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        f.save(filepath)

        photo = Photo(
            url=f"/uploads/{filename}",
            mode=mode,
            category=category if mode == "dueno" else None,
            caption=caption if mode == "usuario" else None,
        )
        db.session.add(photo)
        saved.append(photo)

    db.session.commit()
    return jsonify([p.serialize() for p in saved]), 201


@api.route('/photos', methods=['GET'])
def get_photos():
    mode = request.args.get('mode')
    query = Photo.query.order_by(Photo.created_at.desc())
    if mode:
        query = query.filter_by(mode=mode)
    return jsonify([p.serialize() for p in query.all()]), 200

# --- NUEVA RUTA DE BORRADO ---


@api.route('/photo/<int:photo_id>', methods=['DELETE'])
def delete_photo(photo_id):
    # 1. Buscar el registro en la DB
    photo = Photo.query.get(photo_id)

    if not photo:
        return jsonify({"error": "La foto no existe"}), 404

    try:
        # 2. Obtener el nombre real del archivo (quitando el '/uploads/')
        filename = photo.url.replace("/uploads/", "")
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        # 3. Eliminar el archivo físico si existe
        if os.path.exists(filepath):
            os.remove(filepath)

        # 4. Eliminar el registro de la base de datos
        db.session.delete(photo)
        db.session.commit()

        return jsonify({"message": "Foto eliminada con éxito"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
