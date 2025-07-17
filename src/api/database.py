import pandas as pd
from fastapi import APIRouter, Form
from src.data import data_manager
from src.logic import api_client
from src.models import FdcId, ManualFoodEntry

router = APIRouter()

@router.get("/api/nutrient-database")
async def get_nutrient_database():
    try:
        db = data_manager.read_nutrient_database()
        db = db.where(pd.notnull(db), None)
        return db.to_dict('records')
    except Exception as e:
        print(f"Error processing nutrient database for API: {e}")
        return []

@router.post("/api/nutrient-database/fdc")
async def add_food_from_fdc(fdc_id: FdcId):
    nutrient_data = api_client.get_nutrient_data(fdc_id.fdc_id)
    if nutrient_data:
        data_manager.write_to_nutrient_database(nutrient_data)
        return {"message": f"'{nutrient_data['Name']}' wurde zur Datenbank hinzugefügt."}
    return {"error": "Lebensmittel konnte nicht gefunden werden."}

@router.post("/api/nutrient-database/manual")
async def add_food_manually(entry: ManualFoodEntry):
    manual_data = {
        'FDC_Nr': '', 
        'Name': entry.name, 
        'Kalorien': f'{entry.calories} kcal', 
        'Kohlenhydrate': f'{entry.carbohydrates} g', 
        'Protein': f'{entry.protein} g', 
        'Fett': f'{entry.fat} g', 
        'Kalzium': f'{entry.calcium} mg', 
        'Vitamin B12': f'{entry.vitamin_b12} µg', 
        'Eisen': f'{entry.iron} mg', 
        'Jod': f'{entry.iodine} µg', 
        'Vitamin C': f'{entry.vitamin_c} mg', 
        'Zink': f'{entry.zinc} mg', 
        'Mehrfach-ungesättigte-Fettsäuren': f'{entry.polyunsaturated_fat} g'
    }
    data_manager.write_to_nutrient_database(manual_data)
    return {"message": f"'{entry.name}' wurde zur Datenbank hinzugefügt."}
