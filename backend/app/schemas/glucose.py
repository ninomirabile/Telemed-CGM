from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class GlucoseReadingBase(BaseModel):
    timestamp: datetime
    value: float
    trend: Literal["rising", "falling", "stable", "rising_rapidly", "falling_rapidly"]
    mode: Literal["mock", "real"]


class GlucoseReadingCreate(GlucoseReadingBase):
    pass


class GlucoseReading(GlucoseReadingBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
