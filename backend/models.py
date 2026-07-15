from database import Base
from sqlalchemy import Column, Integer, String

class Klient(Base):
    __tablename__ = 'klienci'

    id=Column(Integer, primary_key=True)
    nazwa = Column(String(50))
    nip=Column(String(10))
    branza=Column(String(100))
    osoba_kontaktowa=Column(String(100))
    email=Column(String(30))
    numer_telefonu=Column(String(20))
    status=Column(String(50), default="Lead")
