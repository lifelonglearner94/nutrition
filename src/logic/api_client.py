import requests

API_KEY = 'Fv5eoxHABKnZXh71TM6V8t6ZLeg7QOSP8RTh37ll'
BASE_URL = 'https://api.nal.usda.gov/fdc/v1/food/'

def get_nutrient_data(food_id: str) -> dict | None:
    """
    Fetches nutrition data for a given food ID from the USDA FoodData Central API.

    Args:
        food_id: The FDC Number of the food item.

    Returns:
        A dictionary containing the nutrient data, or None if the request fails.
    """
    food_id = food_id.strip()
    if not food_id.isdigit():
        return None

    url = f'{BASE_URL}{food_id}?api_key={API_KEY}'

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
        return None

    return _extract_nutrient_data(data)

def _extract_nutrient_data(data: dict) -> dict:
    """
    Extracts relevant nutrient data from the API response.
    """
    food_nutrients = data.get('foodNutrients', [])
    
    nutrients = {
        'FDC_Nr': data.get('fdcId'),
        'Name': data.get('description'),
        'Kalorien': '',
        'Kohlenhydrate': '',
        'Protein': '',
        'Fett': '',
        'Kalzium': '',
        'Vitamin B12': '',
        'Eisen': '',
        'Jod': '',
        'Vitamin C': '',
        'Zink': '',
        'Mehrfach-ungesättigte-Fettsäuren': ''
    }

    nutrient_mapping = {
        'Protein': 'Protein',
        'Total lipid (fat)': 'Fett',
        'Carbohydrate, by difference': 'Kohlenhydrate',
        'Energy': 'Kalorien',
        'Vitamin B-12': 'Vitamin B12',
        'Iron, Fe': 'Eisen',
        'Iodine, I': 'Jod',
        'Vitamin C, total ascorbic acid': 'Vitamin C',
        'Zinc, Zn': 'Zink',
        'Fatty acids, total polyunsaturated': 'Mehrfach-ungesättigte-Fettsäuren',
        'Calcium, Ca': 'Kalzium'
    }

    for item in food_nutrients:
        nutrient_name = item.get('nutrient', {}).get('name')
        amount = item.get('amount', 0)
        unit_name = item.get('nutrient', {}).get('unitName', '')

        for key, value in nutrient_mapping.items():
            if key in nutrient_name:
                nutrients[value] = f'{amount} {unit_name}'
                break

    return nutrients
