from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.schemas.glucose import GlucoseReading
from app.services.glucose_service import (
    create_glucose_reading,
    generate_mock_glucose_reading,
    get_glucose_readings,
    get_latest_glucose_reading,
)

router = APIRouter(prefix="/glucose", tags=["glucose"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/mock")
def get_mock_readings(db: Session = Depends(get_db)):
    """Get the last 12 glucose readings from database"""
    readings = get_glucose_readings(db, skip=0, limit=12)
    if not readings:
        # If no readings exist, create some mock data
        for _ in range(12):
            mock_reading = generate_mock_glucose_reading()
            create_glucose_reading(db, mock_reading)
        readings = get_glucose_readings(db, skip=0, limit=12)
    return {"status": "success", "data": readings}


@router.post("/fetch", response_model=GlucoseReading)
def force_reading(db: Session = Depends(get_db)):
    """Force a new glucose reading (creates mock data)"""
    mock_reading = generate_mock_glucose_reading()
    return create_glucose_reading(db, mock_reading)


@router.get("/latest", response_model=GlucoseReading)
def get_latest_reading(db: Session = Depends(get_db)):
    """Get the latest glucose reading"""
    reading = get_latest_glucose_reading(db)
    if not reading:
        raise HTTPException(status_code=404, detail="No glucose readings found")
    return reading


@router.get("/readings", response_model=List[GlucoseReading])
def get_readings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get glucose readings with pagination"""
    return get_glucose_readings(db, skip=skip, limit=limit)
