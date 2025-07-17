import pandas as pd

def get_reference_intake(age_in_months: int, weight_in_kg: float) -> dict | None:
    """
    Calculates the daily reference intake based on age and weight.
    """
    reference_intake = {}

    if age_in_months <= 3:
        calories = 110 * weight_in_kg
        reference_intake = {
            'Kalorien': calories,
            'Kohlenhydrate': calories * 0.55 / 4,
            'Protein': 8,
            'Fett': calories * 0.47 / 9,
            'Kalzium': 220,
            'Vitamin B12': 0.5,
            'Eisen': 0.5,
            'Jod': 40,
            'Vitamin C': 20,
            'Zink': 1.5,
            'Mehrfach-ungesättigte-Fettsäuren': calories * 0.045 / 9
        }
    elif 4 <= age_in_months <= 11:
        calories = 110 * weight_in_kg
        reference_intake = {
            'Kalorien': calories,
            'Kohlenhydrate': calories * 0.55 / 4,
            'Protein': 1.3 * weight_in_kg,
            'Fett': calories * 0.4 / 9,
            'Kalzium': 330,
            'Vitamin B12': 1.4,
            'Eisen': 8,
            'Jod': 80,
            'Vitamin C': 20,
            'Zink': 2.5,
            'Mehrfach-ungesättigte-Fettsäuren': calories * 0.04 / 9
        }
    elif 12 <= age_in_months <= 47:
        calories = 1200
        reference_intake = {
            'Kalorien': calories,
            'Kohlenhydrate': calories * 0.55 / 4,
            'Protein': 1 * weight_in_kg,
            'Fett': calories * 0.35 / 9,
            'Kalzium': 600,
            'Vitamin B12': 1.5,
            'Eisen': 8,
            'Jod': 100,
            'Vitamin C': 20,
            'Zink': 3,
            'Mehrfach-ungesättigte-Fettsäuren': calories * 0.035 / 9
        }
    elif age_in_months >= 228: # 19 years
        calories = 2400
        reference_intake = {
            'Kalorien': calories,
            'Kohlenhydrate': calories * 0.55 / 4,
            'Protein': 0.8 * weight_in_kg,
            'Fett': calories * 0.30 / 9,
            'Kalzium': 1000,
            'Vitamin B12': 4,
            'Eisen': 12,
            'Jod': 200,
            'Vitamin C': 105,
            'Zink': 14,
            'Mehrfach-ungesättigte-Fettsäuren': calories * 0.03 / 9
        }
    else:
        return None

    return reference_intake

def calculate_actual_values(selected_food_data: dict, quantity: float) -> dict:
    """
    Calculates the nutrient values for a given quantity of a food item.
    """
    # Make a copy to avoid modifying the original dict
    food_data = selected_food_data.copy()

    # Remove non-nutrient fields
    food_data.pop('FDC_Nr', None)
    food_data.pop('Name', None)

    quantity_factor = quantity / 100.0

    calculated_values = {}
    for key, value in food_data.items():
        if value is None:
            calculated_values[key] = 0
        elif isinstance(value, str):
            try:
                # Extract the numeric part of the string
                numeric_value = float(value.split()[0])
                calculated_values[key] = numeric_value * quantity_factor
            except (ValueError, IndexError):
                calculated_values[key] = 0
        elif isinstance(value, (int, float)):
            calculated_values[key] = value * quantity_factor
        else:
            calculated_values[key] = 0

    return calculated_values

def get_daily_intake_summary(reference_intake: dict, daily_summary: pd.DataFrame) -> pd.DataFrame:
    """
    Calculates the percentage of daily intake compared to the reference intake.
    """
    if daily_summary is None or daily_summary.empty:
        return pd.DataFrame()

    # Ensure columns match, otherwise, this will raise an error
    summary_dict = daily_summary.to_dict('records')[0]

    df = pd.DataFrame([reference_intake, summary_dict])

    # Calculate percentage
    percentage = (df.iloc[1] / df.iloc[0] * 100).round(2)

    # Format for display
    df.loc['Prozent heute %'] = percentage
    df = df.round(2)

    def convert_and_format(cell):
        if isinstance(cell, float):
            return str(cell).replace('.', ',')
        return str(cell)

    df = df.map(convert_and_format)

    # Add '%' sign to the percentage row
    for col in df.columns:
        df.at['Prozent heute %', col] += ' %'

    df.index = ['Referenzwert', 'Heutige Zufuhr', 'Prozent heute %']
    df.insert(0, '', df.index)

    return df
