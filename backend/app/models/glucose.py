import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String

from app.models.base import Base


class GlucoseReading(Base):
    __tablename__ = "glucose_readings"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    value = Column(Float, nullable=False)
    trend = Column(String, nullable=False)
    mode = Column(String, nullable=False, default="mock")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
