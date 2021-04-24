import psycopg2
import sys
import os
import json
import re

DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL == None or DATABASE_URL == '':
    print('The postgres connection string DATABASE_URL is missing')
    sys.exit(1)

# Connect to the database
db = psycopg2.connect(DATABASE_URL)
cursor = db.cursor()

def log(message):
    query = ("select etl_log('{msg}');").format(msg=message)
    cursor.execute(query)
    db.commit()

# Import process goes here