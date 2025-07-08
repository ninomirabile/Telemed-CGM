from sqlalchemy import Column, Integer, String, Float, DateTime
from app.models.base import Base
import datetime

class GlucoseReading(Base):
    __tablename__ = "glucose_readings"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    value = Column(Float, nullable=False)
    trend = Column(String, nullable=False)
    mode = Column(String, nullable=False, default="mock")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False) 