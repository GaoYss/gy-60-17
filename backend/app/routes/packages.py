from flask import Blueprint, jsonify

from ..data import PACKAGES

packages_bp = Blueprint("packages", __name__)


@packages_bp.get("")
def list_packages():
    return jsonify(PACKAGES)
