from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.api.v1.instagram import router as instagram_router

api_v1_router = APIRouter()
api_v1_router.include_router(health_router)
api_v1_router.include_router(instagram_router)