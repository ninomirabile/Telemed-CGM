import random
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.glucose import GlucoseReading
from app.schemas.glucose import GlucoseReadingCreate


def create_glucose_reading(
    db: Session, glucose_reading: GlucoseReadingCreate
) -> GlucoseReading:
    db_glucose_reading = GlucoseReading(**glucose_reading.dict())
    db.add(db_glucose_reading)
    db.commit()
    db.refresh(db_glucose_reading)
    return db_glucose_reading


def get_glucose_readings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(GlucoseReading).offset(skip).limit(limit).all()


def get_latest_glucose_reading(db: Session):
    return db.query(GlucoseReading).order_by(GlucoseReading.timestamp.desc()).first()


def generate_mock_glucose_reading() -> GlucoseReadingCreate:
    """Generate a realistic mock glucose reading"""
    trends = ["rising", "falling", "stable", "rising_rapidly", "falling_rapidly"]

    # Generate realistic glucose values (70-300 mg/dL)
    value = random.uniform(70, 300)
    trend = random.choice(trends)

    return GlucoseReadingCreate(
        timestamp=datetime.utcnow(), value=round(value, 1), trend=trend, mode="mock"
    )
