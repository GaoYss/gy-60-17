from flask import Blueprint, jsonify

from ..data import DELIVERIES

deliveries_bp = Blueprint("deliveries", __name__)


@deliveries_bp.get("")
def list_deliveries():
    summaries = [
        {
            "code": item["code"],
            "client": item["client"],
            "title": item["title"],
            "status": item["status"],
            "deliveredAt": item["deliveredAt"],
            "expiresAt": item["expiresAt"],
            "photoCount": len(item["photos"]),
            "selectedCount": len([photo for photo in item["photos"] if photo["selected"]]),
        }
        for item in DELIVERIES
    ]
    return jsonify(summaries)


@deliveries_bp.get("/<code>")
def get_delivery(code):
    delivery = next((item for item in DELIVERIES if item["code"] == code), None)
    if delivery is None:
        return jsonify({"message": "交付链接不存在"}), 404
    return jsonify(delivery)
