from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal, Base
import models
from pydantic import BaseModel, EmailStr

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class KlientSchema(BaseModel):
    nazwa: str
    nip: str
    branza: str
    osoba_kontaktowa: str
    email: EmailStr
    status: str = "Lead"

@app.post("/api/dodaj-klienta")
def dodaj_klienta(klient_dane: KlientSchema):
    db = SessionLocal()

    nowy_klient = models.Klient(
        nazwa=klient_dane.nazwa,
        nip=klient_dane.nip,
        branza=klient_dane.branza,
        osoba_kontaktowa=klient_dane.osoba_kontaktowa,
        email=klient_dane.email,
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

        db.commit()
        db.close()
        return {"status":"zaktualizowano"}
    
    db.close()
    return {"status":"nie znaleziono"}


if __name__ =="__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)