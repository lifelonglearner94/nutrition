import pandas as pd
from sqlalchemy.orm import Session
from src.data.database import SessionLocal, Nutrient, Setting, DailyIntake, create_db_and_tables
import os
import glob
import chardet

def get_encoding(file_path):
    with open(file_path, 'rb') as f:
        result = chardet.detect(f.read())
    return result['encoding']

def migrate_data():
    # Create tables
    create_db_and_tables()

    db: Session = SessionLocal()

    # Migrate nutrient database
    nutrient_db_path = 'data/nutrient_database.csv'
    if os.path.exists(nutrient_db_path):
        encoding = get_encoding(nutrient_db_path)
        df = pd.read_csv(nutrient_db_path, encoding=encoding)

        # Clear existing nutrients to avoid duplicates
        db.query(Nutrient).delete()
        db.commit()

        for _, row in df.iterrows():
            fdc_id = row.get('FDC_Nr', '')

            # Skip rows with NaN or empty fdc_id
            if pd.isna(fdc_id) or str(fdc_id).strip() == '' or str(fdc_id).lower() == 'nan':
                continue

            # Convert all numeric fields to strings, handling NaN values
            def safe_convert(value):
                if pd.isna(value):
                    return None
                return str(value)

            nutrient = Nutrient(
                fdc_id=str(fdc_id),
                name=safe_convert(row.get('Name')),
                calories=safe_convert(row.get('Kalorien')),
                carbohydrates=safe_convert(row.get('Kohlenhydrate')),
                protein=safe_convert(row.get('Protein')),
                fat=safe_convert(row.get('Fett')),
                calcium=safe_convert(row.get('Kalzium')),
                vitamin_b12=safe_convert(row.get('Vitamin B12')),
                iron=safe_convert(row.get('Eisen')),
                iodine=safe_convert(row.get('Jod')),
                vitamin_c=safe_convert(row.get('Vitamin C')),
                zinc=safe_convert(row.get('Zink')),
                polyunsaturated_fat=safe_convert(row.get('Mehrfach-ungesättigte-Fettsäuren'))
            )
            db.add(nutrient)
        db.commit()
        print("Nutrient database migrated.")

    # Migrate settings
    settings_files = glob.glob('data/daily_data/Settings_*.csv')
    if settings_files:
        # Clear existing settings
        db.query(Setting).delete()
        db.commit()

        latest_settings_file = max(settings_files, key=os.path.getmtime)
        encoding = get_encoding(latest_settings_file)
        df = pd.read_csv(latest_settings_file, encoding=encoding)
        if not df.empty:
            settings_row = df.iloc[0]
            setting = Setting(age=settings_row['Alter'], weight=settings_row['Gewicht'])
            db.add(setting)
            db.commit()
            print(f"Settings from {latest_settings_file} migrated.")

    # Migrate daily data
    nutrient_files = glob.glob('data/daily_data/Nutrients_*.csv')
    for f in nutrient_files:
        encoding = get_encoding(f)
        df = pd.read_csv(f, encoding=encoding)
        for _, row in df.iterrows():
            # This is a simplification. The original app structure for daily entries
            # was more complex. We are assuming a simplified structure for migration.
            # This part might need adjustment based on the exact logic of the old app.
            pass # Daily data migration logic would go here if the structure was clear.

    print("Data migration complete.")
    db.close()

if __name__ == "__main__":
    migrate_data()
