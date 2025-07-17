import pytest
from src.logic.nutrition_calculator import get_reference_intake, calculate_actual_values

def test_get_reference_intake():
    # Test case for a 2-month-old baby weighing 5kg
    age = 2
    weight = 5
    expected_calories = 110 * weight
    intake = get_reference_intake(age, weight)
    assert intake is not None
    assert intake['Kalorien'] == expected_calories
    assert intake['Protein'] == 8

    # Test case for a 1-year-old (12 months) weighing 10kg
    age = 12
    weight = 10
    expected_calories = 1200
    intake = get_reference_intake(age, weight)
    assert intake is not None
    assert intake['Kalorien'] == expected_calories
    assert intake['Protein'] == 1 * weight

def test_calculate_actual_values():
    food_data = {
        'FDC_Nr': '12345',
        'Name': 'Test Food',
        'Kalorien': '100 kcal',
        'Protein': '10 g',
        'Fett': '5 g',
        'Kohlenhydrate': '20 g'
    }
    quantity = 50  # 50g
    
    calculated = calculate_actual_values(food_data, quantity)
    
    assert calculated['Kalorien'] == 50
    assert calculated['Protein'] == 5
    assert calculated['Fett'] == 2.5
    assert calculated['Kohlenhydrate'] == 10
