import pandas as pd
import os
from datetime import datetime
from sqlalchemy.orm import Session
from .database import SessionLocal, Nutrient, Setting, DailyIntake

DATA_DIR = 'data'
DAILY_DATA_DIR = os.path.join(DATA_DIR, 'daily_data')
DB_PATH = os.path.join(DATA_DIR, 'nutrient_database.csv')

def get_todays_filename(prefix: str, folder_path: str = DAILY_DATA_DIR) -> str:
    """
    Generates a filename with today's date.
    """
    today = datetime.now().strftime("%d.%m.%Y")
    return os.path.join(folder_path, f"{prefix}_{today}.csv")

def get_settings_filepath() -> str:
    """
    Returns the filepath for today's settings file.
    """
    return get_todays_filename('Settings')

def get_nutrients_filepath() -> str:
    """
    Returns the filepath for today's nutrients file.
    """
    return get_todays_filename('Nutrients')

def read_settings() -> tuple[int, float] | None:
    """
    Reads the age and weight from the database.
    """
    db: Session = SessionLocal()
    try:
        setting = db.query(Setting).first()
        if setting:
            return int(setting.age), float(setting.weight)
        return None
    finally:
        db.close()

def save_settings(age: int, weight: float):
    """
    Saves the age and weight to the database.
    """
    db: Session = SessionLocal()
    try:
        # Clear existing settings
        db.query(Setting).delete()
        # Add new setting
        setting = Setting(age=age, weight=weight)
        db.add(setting)
        db.commit()
    finally:
        db.close()

def read_nutrient_database() -> pd.DataFrame:
    """
    Reads the nutrient database from SQLite, returning an empty DataFrame on error.
    """
    columns=['FDC_Nr', 'Name', 'Kalorien', 'Kohlenhydrate', 'Protein', 'Fett', 'Kalzium', 'Vitamin B12', 'Eisen', 'Jod', 'Vitamin C', 'Zink', 'Mehrfach-ungesättigte-Fettsäuren']

    db: Session = SessionLocal()
    try:
        nutrients = db.query(Nutrient).all()
        if not nutrients:
            return pd.DataFrame(columns=columns)

        data = []
        for nutrient in nutrients:
            data.append({
                'FDC_Nr': nutrient.fdc_id,
                'Name': nutrient.name,
                'Kalorien': nutrient.calories,
                'Kohlenhydrate': nutrient.carbohydrates,
                'Protein': nutrient.protein,
                'Fett': nutrient.fat,
                'Kalzium': nutrient.calcium,
                'Vitamin B12': nutrient.vitamin_b12,
                'Eisen': nutrient.iron,
                'Jod': nutrient.iodine,
                'Vitamin C': nutrient.vitamin_c,
                'Zink': nutrient.zinc,
                'Mehrfach-ungesättigte-Fettsäuren': nutrient.polyunsaturated_fat
            })

        return pd.DataFrame(data)
    except Exception as e:
        print(f"Error reading nutrient database: {e}")
        return pd.DataFrame(columns=columns)
    finally:
        db.close()

def write_to_nutrient_database(data: dict):
    """
    Writes a new entry to the nutrient database.
    """
    db: Session = SessionLocal()
    try:
        nutrient = Nutrient(
            fdc_id=data.get('FDC_Nr', ''),
            name=data.get('Name'),
            calories=data.get('Kalorien'),
            carbohydrates=data.get('Kohlenhydrate'),
            protein=data.get('Protein'),
            fat=data.get('Fett'),
            calcium=data.get('Kalzium'),
            vitamin_b12=data.get('Vitamin B12'),
            iron=data.get('Eisen'),
            iodine=data.get('Jod'),
            vitamin_c=data.get('Vitamin C'),
            zinc=data.get('Zink'),
            polyunsaturated_fat=data.get('Mehrfach-ungesättigte-Fettsäuren')
        )
        db.add(nutrient)
        db.commit()
    finally:
        db.close()

def delete_from_nutrient_database(name: str):
    """
    Deletes a food item from the nutrient database by name.
    """
    db: Session = SessionLocal()
    try:
        db.query(Nutrient).filter(Nutrient.name == name).delete()
        db.commit()
    finally:
        db.close()

def save_daily_nutrient_entry(entry: dict):
    """
    Saves a new nutrient entry to today's daily log in the database.
    """
    db: Session = SessionLocal()
    try:
        # For now, we'll store food name and quantity - you might want to expand this
        daily_entry = DailyIntake(
            food_name=entry.get('food_name', ''),
            quantity=entry.get('quantity', 0.0),
            date=datetime.now().date()
        )
        db.add(daily_entry)
        db.commit()
    finally:
        db.close()

def get_daily_summary() -> pd.DataFrame | None:
    """
    Reads and summarizes today's nutrient intake from the database.
    Returns aggregated nutritional values for all foods consumed today.
    """
    from src.logic import nutrition_calculator

    db: Session = SessionLocal()
    try:
        today = datetime.now().date()
        daily_entries = db.query(DailyIntake).filter(DailyIntake.date == today).all()

        if not daily_entries:
            return None

        # Get nutrient database for lookups
        nutrient_db = read_nutrient_database()

        # Initialize total nutritional values
        total_nutrients = {
            'Kalorien': 0.0,
            'Kohlenhydrate': 0.0,
            'Protein': 0.0,
            'Fett': 0.0,
            'Kalzium': 0.0,
            'Vitamin B12': 0.0,
            'Eisen': 0.0,
            'Jod': 0.0,
            'Vitamin C': 0.0,
            'Zink': 0.0,
            'Mehrfach-ungesättigte-Fettsäuren': 0.0
        }

        # Calculate nutritional values for each entry and sum them up
        for entry in daily_entries:
            food_match = nutrient_db[nutrient_db['Name'] == entry.food_name]
            if not food_match.empty:
                food_data = food_match.iloc[0].to_dict()
                calculated_values = nutrition_calculator.calculate_actual_values(food_data, entry.quantity)

                # Add to totals
                for nutrient, value in calculated_values.items():
                    if nutrient in total_nutrients:
                        total_nutrients[nutrient] += value

        # Return as DataFrame for compatibility
        return pd.DataFrame([total_nutrients])
    finally:
        db.close()

def get_daily_entry_count() -> int:
    """
    Returns the count of daily entries for today.
    """
    db: Session = SessionLocal()
    try:
        today = datetime.now().date()
        count = db.query(DailyIntake).filter(DailyIntake.date == today).count()
        return count
    finally:
        db.close()
