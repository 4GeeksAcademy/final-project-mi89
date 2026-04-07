from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
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

    # Allows Customer and Owner tables to inherit everything from User
    __mapper_args__ = {
        "polymorphic_on": user_type,
        "polymorphic_identity": "user",
    }

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


class Customer(User):
    __tablename__ = "customer"

    id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    
    photos: Mapped[List["Photo"]
                   ] = relationship(back_populates="customer")
    points: Mapped[List["Point"]
                   ] = relationship(back_populates="customer")
    
    __mapper_args__ = {
        "polymorphic_identity": "customer",
    }


class Owner(User):
    __tablename__ = "owner"

    id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": "owner",
    }

    # restaurants: Mapped[List["Restaurant"]
    #                ] = relationship(back_populates="owner")


class Photo(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customer.id"))
    # restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id"))
    customer: Mapped["Customer"] = relationship(back_populates="photos")
    # restaurant: Mapped["Restaurant"] = relationship(back_populates="photos")
    likes: Mapped[List["Like"]
                   ] = relationship(back_populates="photo")
    comments: Mapped[List["Comment"]
                   ] = relationship(back_populates="photo")


class Like(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    photo_id: Mapped[int] = mapped_column(ForeignKey("photo.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    photo: Mapped["Photo"] = relationship(back_populates="likes")


class Comment(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    comment: Mapped[str] = mapped_column(
        String(300), unique=False, nullable=False)
    photo_id: Mapped[int] = mapped_column(ForeignKey("photo.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    photo: Mapped["Photo"] = relationship(back_populates="comments")


class Point(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customer.id"))
    customer: Mapped["Customer"] = relationship(back_populates="points")


# class Restaurant(db.Model):
#     id: Mapped[int] = mapped_column(primary_key=True)
#     owner_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
#     photos: Mapped[List["Photo"]
#                    ] = relationship(back_populates="restaurant")
#     owner: Mapped["Owner"] = relationship(back_populates="restaurants")


#OLD VERSION OF CUSTOMER BEFORE I TRIED TO MAKE IT INHERIT FROM USER:
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

