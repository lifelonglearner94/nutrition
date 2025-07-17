from fastapi import APIRouter
from src.data import data_manager
from src.logic import nutrition_calculator
from src.models import DailyEntry

router = APIRouter()

@router.get("/api/daily-intake")
async def get_daily_intake():
    summary = data_manager.get_daily_summary()
    if summary is not None and not summary.empty:
        return summary.to_dict('records')[0]
    return {}

@router.post("/api/daily-intake")
async def add_daily_entry(entry: DailyEntry):
    try:
        db_data = data_manager.read_nutrient_database()
        food_match = db_data[db_data['Name'] == entry.food_name]

        if food_match.empty:
            return {"error": "Food not found in database"}

        food_data = food_match.iloc[0].to_dict()
        calculated_values = nutrition_calculator.calculate_actual_values(food_data, entry.quantity)

        # Save the daily entry with basic info
        daily_entry = {
            'food_name': entry.food_name,
            'quantity': entry.quantity
        }
        data_manager.save_daily_nutrient_entry(daily_entry)

        return {"message": "Daily entry saved."}
    except Exception as e:
        return {"error": f"Failed to save entry: {str(e)}"}

@router.get("/api/daily-intake/count")
async def get_daily_entry_count():
    count = data_manager.get_daily_entry_count()
    return {"count": count}
