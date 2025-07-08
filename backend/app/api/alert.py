from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.alert import Alert, AlertCreate
from app.db.session import SessionLocal
from app.services.alert_service import (
    get_alerts, 
    get_active_alerts, 
    mark_alert_as_read, 
    delete_alert,
    create_alert
)
from typing import List

router = APIRouter(prefix="/alerts", tags=["alerts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[Alert])
def get_alerts_endpoint(db: Session = Depends(get_db)):
    """Get all alerts"""
    return get_alerts(db)

@router.get("/active")
def get_active_alerts_endpoint(db: Session = Depends(get_db)):
    """Get only active alerts"""
    alerts = get_active_alerts(db)
    if not alerts:
        # Create some mock alerts if none exist
        mock_alerts = [
            AlertCreate(
                glucose_reading_id=1,
                alert_type="high_glucose",
                message="Glucose level is high!",
                severity="warning"
            ),
            AlertCreate(
                glucose_reading_id=2,
                alert_type="critical_high",
                message="Critical glucose level!",
                severity="critical"
            )
        ]
        for alert_data in mock_alerts:
            create_alert(db, alert_data)
        alerts = get_active_alerts(db)
    return {"status": "success", "data": alerts}

@router.put("/{alert_id}/read", response_model=Alert)
def mark_alert_as_read_endpoint(alert_id: int, db: Session = Depends(get_db)):
    """Mark an alert as read"""
    alert = mark_alert_as_read(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.delete("/{alert_id}")
def delete_alert_endpoint(alert_id: int, db: Session = Depends(get_db)):
    """Delete an alert"""
    success = delete_alert(db, alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert deleted successfully"} 