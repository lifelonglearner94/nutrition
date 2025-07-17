import pytest
import pandas as pd
from src.data import data_manager
import os

@pytest.fixture
def temp_data_dir(tmp_path):
    """
    Create a temporary data directory structure for testing.
    """
    data_dir = tmp_path / "data"
    daily_data_dir = data_dir / "daily_data"
    daily_data_dir.mkdir(parents=True)

    # Create a dummy nutrient database
    db_path = data_dir / "nutrient_database.csv"
    dummy_db = pd.DataFrame({
        'FDC_Nr': [1, 2],
        'Name': ['Apple', 'Banana'],
        'Kalorien': ['52 kcal', '89 kcal']
    })
    dummy_db.to_csv(db_path, index=False, encoding='ISO-8859-1')

    # Monkeypatch the data_manager paths
    monkeypatch = pytest.MonkeyPatch()
    monkeypatch.setattr(data_manager, 'DATA_DIR', str(data_dir))
    monkeypatch.setattr(data_manager, 'DAILY_DATA_DIR', str(daily_data_dir))
    monkeypatch.setattr(data_manager, 'DB_PATH', str(db_path))

    yield tmp_path

    monkeypatch.undo()

def test_save_and_read_settings(temp_data_dir):
    # The fixture already monkeypatches the paths

    # Test saving settings
    age = 24
    weight = 12.5
    data_manager.save_settings(age, weight)

    # Test reading settings
    read_age, read_weight = data_manager.read_settings()

    assert age == read_age
    assert weight == read_weight

def test_read_nutrient_database(temp_data_dir):
    df = data_manager.read_nutrient_database()
    assert not df.empty
    # Check for any apple-related food item
    assert any('apple' in name.lower() for name in df['Name'].values)
