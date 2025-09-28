
# FastAPI for HTTP Python connection

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from agent import fetch_response
import json
import re
import os

app = FastAPI()
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:8000 "
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Listening

@app.post("/agent/chat")
async def chat_agent(request: Request):
    data = await request.json()
    session_id = str ( data.get("sessionId") )
    user_id = str ( data.get("userId") )
    
    path = "./db/{}".format ( str ( user_id ) )
    
    if os.path.exists ( path ) and (session_id in os.listdir ( path )):
        request = ( data.get("data") )['message']
    else:
        request =  ( data.get("data") )['initialPreferenceData']
        
    response = fetch_response ( request, user_id, session_id )

    is_json = 0
    if re.search(r"\{.*\}", response, re.DOTALL ):
        is_json = 1
    response = { 'is_json' : is_json, 'response' : response }

    print ( json.dumps ( response ) ) # For debugging
    return response
