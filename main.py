
# FastAPI for HTTP Python connection

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from agent import fetch_response
import json
import re
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Listening

@app.post("/agent/chat")
async def chat_agent(request: Request):
    data = await request.json()
    session_id = data.get("sessionId")
    user_id = data.get("userId")
    print(data)
    path = "./db/{}".format ( str ( user_id ) )
    
    if os.path.exists ( path ) and (session_id in os.listdir ( path )):
        request = data.get("message")
    else:
        request = data.get("initialPreferenceData")
        
    response = fetch_response ( request, user_id, session_id )

    is_json = 0
    if re.search(r"\{.*\}", response, re.DOTALL ):
        is_json = 1
    response = { 'is_json' : is_json, 'response' : response }

    print ( json.dumps ( response ) ) # For debugging
    return response
