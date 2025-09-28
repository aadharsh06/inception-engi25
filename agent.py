
# Agno for agentic AI and storage of sessions

import os
from typing import List
from pydantic import BaseModel, Field
from agno.agent import Agent
from agno.models.google import Gemini
from agno.db.sqlite import SqliteDb
from GoogleNews import GoogleNews
from req_in import get
import json
import re
from pathlib import Path
from random import choice

def is_json(s: str) -> bool:
    try:
        json.loads(s)
        return True
    except ValueError:
        return False

# Randomize API key for mitigating 503 (Service Unavailable) Error

def change_key():
    api_keys = [ "AIzaSyB1zyLq1XcqygCUBgwQBBRwxBTSu8m7ouU", "AIzaSyCefICyZ0Ul2vqvhsbNBjX1Cien2OAhiMo", "AIzaSyDreTPcj_NxU55PKsEdygE-10X5-KF7Jcc", "AIzaSyAt9XnLt5yGzl0iycaqGrWy4F8c2SV1INA" ]
    os.environ["GOOGLE_API_KEY"] = choice ( api_keys )

db = SqliteDb ( db_file = "db/data.db" )

# The main agent

agent = Agent(
        model=Gemini(id="gemini-2.0-flash", grounding=True),
        description="You are a master in portfolio management. Always return PortfolioOutput in JSON format.",
        db=db,
        search_session_history=True,
        num_history_sessions=2,
        markdown=True
    )

# A new session -> Make new file under user folder, and generate new portfolio

def new_session ( path, portfolio_request, userid, sessionid ):
    response_str = agent.run(
        """You are a master in portfolio management.
    You are given a JSON describing a user's profile, market conditions, and constraints.
    Generate a portfolio output in JSON matching the PortfolioOutput model. Do not give examples.
    Give the exact stock or asset to invest in. Make sure person's country matches the stock location as well. Give importance to the preferences of the user. But keep
    Remove all citaions.
    
    PortfolioOutput:
    {
      "portfolio_summary": {
        "total_investment": float,
        "expected_annual_return": float,
        "risk_level": str,
        "max_drawdown": float
      },
      "allocations": [
        {
          "asset": str,
          "sector": str,
          "allocation_percentage": float
        }
      ],
      "sector_allocation": {
        "sector_name": float
      },
      "strategy": str
    }

    Include BOTH:
    - Sector level allocations (ETFs or sector groupings)
    - Individual stocks and other asset types (cash, bonds, commodities)

    For each asset, provide:
    - asset name
    - allocation percentage
    - expected return
    - risk
    - ESG rating (if available)
    - rationale

    Do not include extra text outside the JSON.
    """
        + json.dumps(portfolio_request, indent=2),
        user_id=userid,
        session_id=userid+sessionid
    ).get_content_as_string()

    json_match = re.search(r"\{.*\}", response_str, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
    else:
        raise ValueError("No JSON found in response.")
    with open ( path + "\\{}".format ( str ( sessionid ) ), 'w' ) as f:
        f.write ( json_str )
        
    return ( json_str )

# Either generate new portfolio or just plain text response (depending on query)

def continue_session ( path, request, userid, sessionid ):

    googlenews = GoogleNews(lang='en', region='IN')
    googlenews.search(str ( request ))

    results = googlenews.results()
    results = str(results[:10])

    cur_portfolio = ""
    with open ( path + "//{}".format ( sessionid ), 'r' ) as f:
            cur_portfolio = f.read()
    
    response_str = agent.run (
        """This is the user response: {}
            Now if the user is asking you to make a new portfolio from suggestions or anything,
            make it all over again USING ONLY THESE COMMANDS BELOW:

            You are a master in portfolio management.
            You already know the user's profile, market conditions, and constraints. Update this portfolio based on the users new preference.
            Generate a portfolio output in JSON matching the existing model. Do not give examples.
            Give the exact stock or asset to invest in. Make sure person's country matches the stock location as well. Give importance to the preferences of the user. But keep
            Remove all citaions.
            
            {}

            Include BOTH:
            - Sector level allocations (ETFs or sector groupings)
            - Individual stocks and other asset types (cash, bonds, commodities)

            For each asset, provide:
            - asset name
            - allocation percentage
            - expected return
            - risk
            - ESG rating (if available)
            - rationale

            Do not include extra text outside the JSON.

            ELSE,
            If the user does not request an update, maybe some explanation or something is required,
            so give a response which is explained with facts and numbers. Do not say I do not have
            real time data or I do not have access to something. Worst case, just use historical data for justification from a web search.
            Here are some recent news to help you out. Use these.{}\n\nDO NOT BOLD ANY OF YOUR ANSWERS USING **
            DO NOT FOLLOW PORTFOLIO FORMAT IF THERE IS NO UPDATE. """.format ( str ( cur_portfolio ), request, results ),
        user_id=userid,
        session_id=userid+sessionid,
        add_history_to_context = True ).get_content_as_string()

    json_match = re.search(r"\{.*\}", response_str, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
        with open ( path + "//{}".format ( sessionid ), 'w' ) as f:
            f.write ( json_str )
    
    return ( response_str )

# FastAPI calls this function to get response

def fetch_response ( request, userid, sessionid ):
    print ( os.listdir ( "./db" ) )
    if userid not in os.listdir ( "./db" ):
        os.mkdir ( "./db/{}".format ( str ( userid ) ) )

    path = "./db/{}".format ( str ( userid ) )

    worked = 1
    response = "0"
    change_key()
    
    while ( ( worked and worked != 10 ) and ( response != "" or response != "0" ) ):
        try:
            if sessionid not in os.listdir ( path ):
                response = new_session ( path, request, userid, sessionid )
            else:
                response = continue_session ( path, request, userid, sessionid )
            worked = 0
        except Exception as e:
            print ( "| Trying again.." )
            change_key()
            worked += 1

    return response
