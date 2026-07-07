from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine("sqlite:///./crm.db", echo=True)

SessionLocal=sessionmaker(engine)
Base = declarative_base()
