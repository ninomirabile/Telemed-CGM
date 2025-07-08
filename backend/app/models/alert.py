from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from app.models.base import Base
import datetime

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    glucose_reading_id = Column(Integer, ForeignKey("glucose_readings.id"), nullable=False)
    alert_type = Column(String, nullable=False)
    message = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False) 