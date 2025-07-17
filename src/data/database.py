from sqlalchemy import create_engine, Column, Integer, String, Float, Date
from sqlalchemy.orm import sessionmaker, declarative_base
import datetime

DATABASE_URL = "sqlite:///./data/nutrition.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Setting(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer)
    weight = Column(Float)

class Nutrient(Base):
    __tablename__ = "nutrients"
    id = Column(Integer, primary_key=True, index=True)
    fdc_id = Column(String, unique=True)
    name = Column(String)
    calories = Column(String)
    carbohydrates = Column(String)
    protein = Column(String)
    fat = Column(String)
    calcium = Column(String)
    vitamin_b12 = Column(String)
    iron = Column(String)
    iodine = Column(String)
    vitamin_c = Column(String)
    zinc = Column(String)
    polyunsaturated_fat = Column(String)

class DailyIntake(Base):
    __tablename__ = "daily_intake"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=datetime.date.today)
    food_name = Column(String)
    quantity = Column(Float)

def create_db_and_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
