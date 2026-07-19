from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal, Base
import models
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class KlientSchema(BaseModel):
    nazwa: str = Field(...)
    nip: str = Field(..., pattern=r'^\d{10}$')
    branza: str
    osoba_kontaktowa: str = Field(...)
    email: EmailStr
    numer_telefonu: Optional[str] = Field(None, min_length=9, max_length=12)
    status: str = "Lead"

    @field_validator('numer_telefonu', mode='before')
    def zamien_pusty_string_na_none(cls, v):
        if v == "":
            return None
        return v

class StatusUpdate(BaseModel):
    status: str

@app.post("/api/dodaj-klienta")
def dodaj_klienta(klient_dane: KlientSchema):
    db = SessionLocal()

    istniejacy_klient = db.query(models.Klient).filter(
        models.Klient.nazwa.ilike(klient_dane.nazwa.strip())
    ).first()

    if istniejacy_klient:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Klient o tej nazwie już istnieje w bazie danych"
        )

    nowy_klient = models.Klient(
        nazwa=klient_dane.nazwa.strip(),
        nip=klient_dane.nip,
        branza=klient_dane.branza,
        osoba_kontaktowa=klient_dane.osoba_kontaktowa,
        email=klient_dane.email,
        numer_telefonu=klient_dane.numer_telefonu,
        status=klient_dane.status
    )

    db.add(nowy_klient)
    db.commit()
    db.refresh(nowy_klient)
    db.close()

    return {"status" : "sukses", "dane": nowy_klient}

@app.get("/api/klienci")
def pobierz_klientow():
    db = SessionLocal()
    klienci = db.query(models.Klient).all()
    db.close()
    return klienci

@app.patch("/api/klienci/{klient_id}/status")
def aktualizuj_status(klient_id: int, dane: StatusUpdate):
    db=SessionLocal()
    klient = db.query(models.Klient).filter(models.Klient.id == klient_id).first()
    if klient:
        klient.status = dane.status

        db.commit()
        db.close()
        return {"status":"zmieniono status"}
    db.close()
    return {"status":"nie znaleziono klienta"}

@app.delete("/api/klienci/{klient_id}")
def usun_klienta(klient_id: int):
    db = SessionLocal()
    klient = db.query(models.Klient).filter(models.Klient.id == klient_id).first()
    if klient:
        db.delete(klient)
        db.commit()
        db.close()
        return {"status":"sukces"}
    db.close()
    return {"status": "nie znaleziono"}

@app.put("/api/klienci/{klient_id}")
def aktualizuj_klienta(klient_id: int, dane: dict):
    db = SessionLocal()
    klient = db.query(models.Klient).filter(models.Klient.id == klient_id).first()
    if klient:
        klient.nazwa = dane.get("nazwa", klient.nazwa)
        klient.nip = dane.get("nip", klient.nip)
        klient.branza = dane.get("branza", klient.branza)
        klient.osoba_kontaktowa = dane.get("osoba_kontaktowa", klient.osoba_kontaktowa)
        klient.email = dane.get("email", klient.email)
        klient.numer_telefonu = dane.get("numer_telefonu", klient.numer_telefonu)

        db.commit()
        db.close()
        return {"status":"zaktualizowano klienta"}
    
    db.close()
    return {"status":"nie znaleziono"}


if __name__ =="__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)