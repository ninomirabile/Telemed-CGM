from pydantic import BaseModel
from datetime import datetime
from typing import Literal

class AlertBase(BaseModel):
    glucose_reading_id: int
    alert_type: Literal['high_glucose', 'low_glucose', 'critical_high', 'critical_low', 'trend_warning', 'connection_lost']
    message: str
    severity: Literal['info', 'warning', 'error', 'critical']
    is_active: bool = True

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True 