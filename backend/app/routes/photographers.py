from flask import Blueprint, jsonify, request

from ..data import PHOTOGRAPHERS, public_photographer

photographers_bp = Blueprint("photographers", __name__)


@photographers_bp.get("")
def list_photographers():
    return jsonify([public_photographer(item) for item in PHOTOGRAPHERS])


@photographers_bp.get("/<photographer_id>/availability")
def get_availability(photographer_id):
    target_date = request.args.get("date")
    photographer = next((item for item in PHOTOGRAPHERS if item["id"] == photographer_id), None)
    if photographer is None:
        return jsonify({"message": "摄影师不存在"}), 404

    if target_date:
        return jsonify(
            {
                "photographerId": photographer_id,
                "date": target_date,
                "slots": photographer["slots"].get(target_date, []),
            }
        )

    return jsonify({"photographerId": photographer_id, "slots": photographer["slots"]})
