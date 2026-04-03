from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

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
    _password: Mapped[str] = mapped_column("password", String(256), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

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
