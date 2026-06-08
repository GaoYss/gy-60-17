from datetime import date
from uuid import uuid4


PACKAGES = [
    {
        "id": "portrait-classic",
        "name": "经典人像套餐",
        "price": 1299,
        "duration": "2 小时",
        "image": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
        "features": ["单人/双人棚拍", "精修 18 张", "全套底片交付", "妆造一次"],
    },
    {
        "id": "wedding-story",
        "name": "婚礼纪实套餐",
        "price": 6800,
        "duration": "全天 8 小时",
        "image": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        "features": ["双机位跟拍", "精修 80 张", "云相册交付", "婚礼快剪"],
    },
    {
        "id": "family-light",
        "name": "家庭轻写真",
        "price": 1880,
        "duration": "3 小时",
        "image": "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
        "features": ["亲子外景", "精修 24 张", "服装建议", "纪念相册一本"],
    },
]

PHOTOGRAPHERS = [
    {
        "id": "lin",
        "name": "林澈",
        "title": "人像摄影师",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
        "tags": ["情绪人像", "棚拍布光", "胶片色彩"],
        "slots": {
            "2026-06-03": ["10:00", "14:00", "17:00"],
            "2026-06-04": ["11:00", "15:30"],
            "2026-06-05": ["09:30", "13:30", "16:00"],
        },
    },
    {
        "id": "miao",
        "name": "苗予",
        "title": "婚礼纪实摄影师",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
        "tags": ["婚礼纪实", "自然光", "抓拍"],
        "slots": {
            "2026-06-03": ["09:00", "13:00"],
            "2026-06-06": ["10:30", "15:00"],
            "2026-06-07": ["12:00", "16:30"],
        },
    },
    {
        "id": "zhou",
        "name": "周屿",
        "title": "家庭与儿童摄影师",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
        "tags": ["家庭写真", "儿童引导", "户外氛围"],
        "slots": {
            "2026-06-04": ["09:00", "12:30", "16:30"],
            "2026-06-05": ["10:30", "15:00"],
            "2026-06-08": ["11:00", "14:30"],
        },
    },
]

BOOKINGS = []

DELIVERIES = [
    {
        "code": "STUDIO-2026-0618",
        "client": "陈小姐",
        "title": "夏日人像写真",
        "status": "可选片",
        "deliveredAt": "2026-05-28",
        "expiresAt": "2026-06-28",
        "retouchLimit": 6,
        "photos": [
            {
                "id": "p01",
                "url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
                "selected": False,
            },
            {
                "id": "p02",
                "url": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
                "selected": True,
            },
            {
                "id": "p03",
                "url": "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=80",
                "selected": False,
            },
            {
                "id": "p04",
                "url": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80",
                "selected": False,
            },
            {
                "id": "p05",
                "url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
                "selected": False,
            },
            {
                "id": "p06",
                "url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
                "selected": True,
            },
        ],
    }
]

SELECTIONS = []


def public_photographer(photographer):
    return {
        "id": photographer["id"],
        "name": photographer["name"],
        "title": photographer["title"],
        "avatar": photographer["avatar"],
        "tags": photographer["tags"],
        "availableDates": list(photographer["slots"].keys()),
    }


def create_booking(payload):
    booking = {
        "id": str(uuid4()),
        "createdAt": date.today().isoformat(),
        "clientName": payload["clientName"],
        "phone": payload["phone"],
        "packageId": payload["packageId"],
        "photographerId": payload["photographerId"],
        "date": payload["date"],
        "time": payload["time"],
        "notes": payload.get("notes", ""),
        "status": "待确认",
    }
    BOOKINGS.insert(0, booking)
    return booking
