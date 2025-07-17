from fastapi import APIRouter, Depends
from src.data import data_manager
from src.logic import nutrition_calculator
from src.models import Settings
from src.dependencies import get_settings

router = APIRouter()

@router.get("/api/settings")
async def get_settings_api(settings: tuple = Depends(get_settings)):
    age, weight = settings
    return {"age": age, "weight": weight}

@router.post("/api/settings")
async def save_settings(settings: Settings):
    data_manager.save_settings(settings.age, settings.weight)
    return {"message": "Settings saved successfully."}

@router.get("/api/reference-intake")
async def get_reference_intake_api(settings: tuple = Depends(get_settings)):
    age, weight = settings
    return nutrition_calculator.get_reference_intake(age, weight)
