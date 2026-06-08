from flask import Blueprint, jsonify, request

from ..data import BOOKINGS, PACKAGES, PHOTOGRAPHERS, create_booking

bookings_bp = Blueprint("bookings", __name__)

REQUIRED_FIELDS = ["clientName", "phone", "packageId", "photographerId", "date", "time"]


@bookings_bp.get("")
def list_bookings():
    return jsonify(BOOKINGS)


@bookings_bp.post("")
def submit_booking():
    payload = request.get_json(silent=True) or {}
    missing = [field for field in REQUIRED_FIELDS if not payload.get(field)]
    if missing:
        return jsonify({"message": "缺少必填字段", "fields": missing}), 400

    if not any(item["id"] == payload["packageId"] for item in PACKAGES):
        return jsonify({"message": "套餐不存在"}), 404

    photographer = next((item for item in PHOTOGRAPHERS if item["id"] == payload["photographerId"]), None)
    if photographer is None:
        return jsonify({"message": "摄影师不存在"}), 404

    available_slots = photographer["slots"].get(payload["date"], [])
    if payload["time"] not in available_slots:
        return jsonify({"message": "该时间不可预约，请重新选择档期"}), 409

    booking = create_booking(payload)
    return jsonify(booking), 201
