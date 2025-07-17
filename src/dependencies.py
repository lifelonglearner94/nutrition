from fastapi import HTTPException
from src.data import data_manager

def get_settings():
    settings = data_manager.read_settings()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found.")
    return settings
