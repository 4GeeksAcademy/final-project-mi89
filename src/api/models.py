from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

# For password security
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


# ── USER (Customer + Owner en una sola tabla) ─────────────────────────────────
class User(db.Model):
    __allow_unmapped__ = True

    id:        Mapped[int] = mapped_column(primary_key=True)
    user_type: Mapped[str] = mapped_column(
        String(15),  nullable=False)   # "customer" | "owner"
    email:     Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    _password: Mapped[str] = mapped_column(
        "password",  String(256), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(),  nullable=False)

    # Relaciones
    uploaded_photos:  "list[Photo]" = relationship(
        "Photo",          foreign_keys="Photo.customer_id",    back_populates="customer")
    restaurant_photos: "list[Photo]" = relationship(
        "Photo",          foreign_keys="Photo.restaurant_id",  back_populates="restaurant")
    likes:            "list[Like]" = relationship(
        "Like",           back_populates="customer")
    comments:         "list[Comment]" = relationship(
        "Comment",        back_populates="customer")
    points_earned:    "list[CustomerPoints]" = relationship(
        "CustomerPoints", foreign_keys="CustomerPoints.customer_id",   back_populates="customer")
    points_given:     "list[CustomerPoints]" = relationship(
        "CustomerPoints", foreign_keys="CustomerPoints.restaurant_id", back_populates="restaurant")

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, new_pass):
        self._password = generate_password_hash(new_pass)

    def check_password_hash(self, password):
        return check_password_hash(self.password, password)

    def serialize(self):
        return {
            "id":        self.id,
            "user_type": self.user_type,
            "email":     self.email,
        }


# ── PHOTO ─────────────────────────────────────────────────────────────────────
# restaurant_id → User donde user_type = "owner"
# customer_id   → User donde user_type = "customer"
class Photo(db.Model):
    __allow_unmapped__ = True

    id:             Mapped[int] = mapped_column(primary_key=True)
    cloudinary_url: Mapped[str] = mapped_column(String(500), nullable=False)
    cloudinary_id:  Mapped[str] = mapped_column(String(200), nullable=False)
    dish_name:      Mapped[str] = mapped_column(String(120), nullable=False)
    # app | entree | dessert | cocktail | mocktail
    category:       Mapped[str] = mapped_column(String(50),  nullable=False)
    created_at:     Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)

    restaurant_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False)
    customer_id:   Mapped[int | None] = mapped_column(
        ForeignKey("user.id"), nullable=True)

    restaurant: "User" = relationship(
        "User", foreign_keys=[restaurant_id], back_populates="restaurant_photos")
    customer:   "User" = relationship(
        "User", foreign_keys=[customer_id],   back_populates="uploaded_photos")
    likes:      "list[Like]" = relationship(
        "Like",    back_populates="photo", cascade="all, delete")
    comments:   "list[Comment]" = relationship(
        "Comment", back_populates="photo", cascade="all, delete")

    def serialize(self):
        return {
            "id":            self.id,
            "image":         self.cloudinary_url,
            "dish":          self.dish_name,
            "category":      self.category,
            "restaurant_id": self.restaurant_id,
            "restaurant":    self.restaurant.email if self.restaurant else "",
            "customer_id":   self.customer_id,
            "username":      f"@{self.customer.email.split('@')[0]}" if self.customer else "@guest",
            "likes":         len(self.likes or []),
            "isHot":         len(self.likes or []) >= 10,
            "points":        len(self.likes or []) * 2 + 10,
            "timeAgo":       self._time_ago(),
        }

    def _time_ago(self):
        diff = datetime.utcnow() - self.created_at
        if diff.seconds < 60:
            return f"{diff.seconds} sec ago"
        if diff.seconds < 3600:
            return f"{diff.seconds // 60} min ago"
        if diff.seconds < 86400:
            return f"{diff.seconds // 3600} hr ago"
        return f"{diff.days} days ago"


# ── CUSTOMER POINTS ───────────────────────────────────────────────────────────
# Puntos por restaurante — customer_id es el cliente, restaurant_id es el owner
class CustomerPoints(db.Model):
    __allow_unmapped__ = True

    id:            Mapped[int] = mapped_column(primary_key=True)
    points:        Mapped[int] = mapped_column(Integer, default=0)
    customer_id:   Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False)
    restaurant_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False)

    customer:   "User" = relationship(
        "User", foreign_keys=[customer_id],   back_populates="points_earned")
    restaurant: "User" = relationship(
        "User", foreign_keys=[restaurant_id], back_populates="points_given")

    def serialize(self):
        return {
            "customer_id":   self.customer_id,
            "restaurant_id": self.restaurant_id,
            "points":        self.points,
        }


# ── LIKE ──────────────────────────────────────────────────────────────────────
class Like(db.Model):
    __allow_unmapped__ = True

    id:          Mapped[int] = mapped_column(primary_key=True)
    photo_id:    Mapped[int] = mapped_column(
        ForeignKey("photo.id"), nullable=False)
    customer_id: Mapped[int | None] = mapped_column(
        ForeignKey("user.id"),  nullable=True)

    photo:    "Photo" = relationship("Photo", back_populates="likes")
    customer: "User" = relationship("User",  back_populates="likes")

    def serialize(self):
        return {"photo_id": self.photo_id, "customer_id": self.customer_id}


# ── COMMENT ───────────────────────────────────────────────────────────────────
class Comment(db.Model):
    __allow_unmapped__ = True

    id:          Mapped[int] = mapped_column(primary_key=True)
    text:        Mapped[str] = mapped_column(Text, nullable=False)
    created_at:  Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    photo_id:    Mapped[int] = mapped_column(
        ForeignKey("photo.id"), nullable=False)
    customer_id: Mapped[int | None] = mapped_column(
        ForeignKey("user.id"),  nullable=True)

    photo:    "Photo" = relationship("Photo", back_populates="comments")
    customer: "User" = relationship("User",  back_populates="comments")

    def serialize(self):
        return {
            "id":          self.id,
            "text":        self.text,
            "photo_id":    self.photo_id,
            "customer_id": self.customer_id,
            "username":    f"@{self.customer.email.split('@')[0]}" if self.customer else "@guest",
            "created_at":  self.created_at.isoformat(),
        }
