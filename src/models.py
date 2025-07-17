from pydantic import BaseModel, Field

class Settings(BaseModel):
    age: int
    weight: float

class DailyEntry(BaseModel):
    food_name: str
    quantity: float

class FdcId(BaseModel):
    fdc_id: str

class ManualFoodEntry(BaseModel):
    name: str = Field(..., alias='Name')
    calories: str = Field(..., alias='Kalorien')
    carbohydrates: str = Field(..., alias='Kohlenhydrate')
    protein: str = Field(..., alias='Protein')
    fat: str = Field(..., alias='Fett')
    calcium: str = Field(..., alias='Kalzium')
    vitamin_b12: str = Field(..., alias='Vitamin_B12')
    iron: str = Field(..., alias='Eisen')
    iodine: str = Field(..., alias='Jod')
    vitamin_c: str = Field(..., alias='Vitamin_C')
    zinc: str = Field(..., alias='Zink')
    polyunsaturated_fat: str = Field(..., alias='Mehrfach_ungesättigte_Fettsäuren')
