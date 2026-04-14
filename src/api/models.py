
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import List

# For password security
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import (
    generate_password_hash,
    check_password_hash,
)

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_type: Mapped[str] = mapped_column(
        String(15), unique=False, nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    _password: Mapped[str] = mapped_column(
        "password", String(256), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    customer: Mapped["Customer"] = relationship(back_populates="user")
    owner: Mapped["Owner"] = relationship(back_populates="user")

    # Allows Customer and Owner tables to inherit everything from User
    # __mapper_args__ = {
    #     "polymorphic_on": user_type,
    #     "polymorphic_identity": "user",
    # }

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
            "id": self.id,
            "user_type": self.user_type,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class Customer(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(25), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    photos: Mapped[List["Photo"]
                   ] = relationship(back_populates="customer")
    points: Mapped[List["Point"]
                   ] = relationship(back_populates="customer")
    user: Mapped["User"] = relationship(back_populates="customer")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "photos": self.photos
        }


class Owner(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(25), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    restaurants = relationship(
        "Restaurant", primaryjoin="Owner.id == Restaurant.owner_id")
    user: Mapped["User"] = relationship(back_populates="owner")
    # Mapped[List["Restaurant"]

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
        }


# class Photo(db.Model):
#     id: Mapped[int] = mapped_column(primary_key=True)
#     customer_id: Mapped[int] = mapped_column(ForeignKey("customer.id"))
#     restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id"))
#     customer: Mapped["Customer"] = relationship(back_populates="photos")
#     restaurant: Mapped["Restaurant"] = relationship(back_populates="photos")
#     likes: Mapped[List["Like"]
#                   ] = relationship(back_populates="photo")
#     comments: Mapped[List["Comment"]
#                      ] = relationship(back_populates="photo")

#     def serialize(self):
#         return {
#             "id": self.id
#         }


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
        ForeignKey("restaurant.id"), nullable=False)
    customer_id:   Mapped[int | None] = mapped_column(
        ForeignKey("customer.id"), nullable=True)

    restaurant: Mapped["Restaurant"] = relationship(
        # fix
        "Restaurant", foreign_keys=[restaurant_id], back_populates="photos")
    customer:   Mapped["Customer"] = relationship(
        # fix
        "Customer", foreign_keys=[customer_id],   back_populates="photos")
    likes:      Mapped["list[Like]"] = relationship(
        "Like",    back_populates="photo", cascade="all, delete")
    comments:   Mapped["list[Comment]"] = relationship(
        "Comment", back_populates="photo", cascade="all, delete")

    def serialize(self):
        return {
            "id":            self.id,
            "image":         self.cloudinary_url,
            "dish":          self.dish_name,
            "category":      self.category,
            "restaurant_id": self.restaurant_id,
            # "restaurant":    self.restaurant.email if self.restaurant else "",
            "customer_id":   self.customer_id,
            "username":      f"@{self.customer.user.email.split('@')[0]}" if self.customer else "@guest",
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


class Like(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    photo_id: Mapped[int] = mapped_column(ForeignKey("photo.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    photo: Mapped["Photo"] = relationship(back_populates="likes")

    def serialize(self):
        return {
            "id": self.id
        }


class Comment(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    comment: Mapped[str] = mapped_column(
        String(300), unique=False, nullable=False)
    photo_id: Mapped[int] = mapped_column(ForeignKey("photo.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    photo: Mapped["Photo"] = relationship(back_populates="comments")

    def serialize(self):
        return {
            "id": self.id
        }


class Point(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customer.id"))
    # customer: Mapped["Customer"] = relationship(back_populates="points")

    restaurant_id: Mapped[int] = mapped_column(
        ForeignKey("restaurant.id"), nullable=False)

    customer:   Mapped["User"] = relationship(
        "Customer", foreign_keys=[customer_id],   back_populates="points")
    restaurant: Mapped["Restaurant"] = relationship(
        "Restaurant", foreign_keys=[restaurant_id])

    def serialize(self):
        return {
            "customer_id":   self.customer_id,
            "restaurant_id": self.restaurant_id,
            "points":        self.points,
        }


class Restaurant(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("owner.id"))
    photos: Mapped[List["Photo"]
                   ] = relationship(back_populates="restaurant")
    # owner: Mapped["Owner"] = relationship(back_populates="restaurants")
    owner = relationship("Owner", back_populates="restaurants",
                         primaryjoin="Owner.id == Restaurant.owner_id")

    def serialize(self):
        return {
            "id": self.id
        }


# OLD VERSION OF CUSTOMER BEFORE I TRIED TO MAKE IT INHERIT FROM USER:
# class Customer(User):
#     id: Mapped[int] = mapped_column(primary_key=True)
#     user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
#     photos: Mapped[List["Photo"]
#                    ] = relationship(back_populates="customer")
#     points: Mapped[List["Point"]
#                    ] = relationship(back_populates="customer")

# OLD VERSION OF OWNER:
# class Owner(db.Model):
#     id: Mapped[int] = mapped_column(primary_key=True)
#     user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
#     # restaurants: Mapped[List["Restaurant"]
#     #                ] = relationship(back_populates="owner")
