from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.schemas.alert import AlertCreate


def create_alert(db: Session, alert: AlertCreate) -> Alert:
    db_alert = Alert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert


def get_alerts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Alert).offset(skip).limit(limit).all()


def get_active_alerts(db: Session):
    return db.query(Alert).filter(Alert.is_active).all()


def mark_alert_as_read(db: Session, alert_id: int):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.is_active = False  # type: ignore
        db.commit()
        return alert
    return None


def delete_alert(db: Session, alert_id: int):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        db.delete(alert)
        db.commit()
        return True
    return False
