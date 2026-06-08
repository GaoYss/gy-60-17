from flask import Flask, jsonify
from flask_cors import CORS

from .routes.bookings import bookings_bp
from .routes.deliveries import deliveries_bp
from .routes.packages import packages_bp
from .routes.photographers import photographers_bp
from .routes.selections import selections_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(packages_bp, url_prefix="/api/packages")
    app.register_blueprint(photographers_bp, url_prefix="/api/photographers")
    app.register_blueprint(bookings_bp, url_prefix="/api/bookings")
    app.register_blueprint(deliveries_bp, url_prefix="/api/deliveries")
    app.register_blueprint(selections_bp, url_prefix="/api/selections")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "studio-booking-api"})

    return app
