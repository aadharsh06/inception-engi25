
# Yfinance for financial data

import requests
import yfinance as yf
from datetime import datetime
from newsapi import NewsApiClient
from GoogleNews import GoogleNews
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import json
import warnings

warnings.filterwarnings("ignore")

# Getting all fields for marker specific json

def market_conditions():
    sp500 = yf.Ticker("^GSPC")
    sp500_hist = sp500.history(period="2d")
    change_pct = (sp500_hist['Close'][-1] - sp500_hist['Close'][-2]) / sp500_hist['Close'][-2] * 100
    market_state = "bull" if change_pct > 0 else "bear"
    return market_state

def volatility_index():
    vix = yf.Ticker("^VIX").history(period="1d")
    volatility_index = vix['Close'].iloc[-1] if not vix.empty else None
    return volatility_index

def news_sentiment():
    newsapi = NewsApiClient(api_key="83a3cbfb562f4e9ab92b75770cc37ed3")

    analyzer = SentimentIntensityAnalyzer()

    sector_query = "Information Technology India"
    all_articles = newsapi.get_everything(q=sector_query, language='en', sort_by='relevancy', page_size=50)

    scores = []
    for article in all_articles['articles']:
        text = article['title'] + ". " + article.get('description', "")
        sentiment = analyzer.polarity_scores(text)
        scores.append(sentiment['compound'])

    news_sentiment_score = round(sum(scores) / len(scores), 2) if scores else 0
    return ( news_sentiment_score )

def sector_data():
    import yfinance as yf
    import pandas as pd
    
    sector_stocks = {
        "Information Technology": ["INFY.NS", "TCS.NS", "WIPRO.NS", "HCLTECH.NS", "TECHM.NS"],
        "Pharmaceuticals": ["SUNPHARMA.NS", "DRREDDY.NS", "CIPLA.NS", "DIVISLAB.NS", "GLENMARK.NS"],
        "Banking & Financial Services": ["HDFCBANK.NS", "ICICIBANK.NS", "KOTAKBANK.NS", "AXISBANK.NS", "SBIN.NS"],
        "Renewable Energy": ["ADANIGREEN.NS", "TATAPOWER.NS", "JSWENERGY.NS", "NTPC.NS", "RELIANCE.NS"],
        "Automobile": ["MARUTI.NS", "TATAMOTORS.NS", "BAJAJ-AUTO.NS", "M&M.NS", "EICHERMOT.NS"],
        "Consumer Goods": ["HINDUNILVR.NS", "ITC.NS", "DABUR.NS", "TATACONSUM.NS", "BRITANNIA.NS"],
        "Metals & Mining": ["JSWSTEEL.NS", "TATASTEEL.NS", "HINDALCO.NS", "NMDC.NS", "SAIL.NS"]
    }

    start_date = "2025-01-01"
    end_date = "2025-09-26"

    sector_d = {}

    for sector, tickers in sector_stocks.items():
        performances = []
        volatilities = []
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(start=start_date, end=end_date)
                if not hist.empty:
                    perf = (hist["Close"][-1] - hist["Close"][0]) / hist["Close"][0] * 100
                    volatility = hist["Close"].pct_change().std() * 100
                    performances.append(perf)
                    volatilities.append(volatility)
            except Exception as e:
                print(f"Error processing {ticker}: {e}")

        if performances:
            avg_perf = sum(performances) / len(performances)
            avg_vol = sum(volatilities) / len(volatilities)
            sector_d[sector] = {
                "performance": round(avg_perf, 2),
                "trend": "upward" if avg_perf > 0 else "downward",
                "volatility": round(avg_vol, 2)
            }

    return sector_d

def get_commidities():
    commodities = {
    "Gold": "GC=F",
    "Silver": "SI=F",
    "Crude Oil": "CL=F"
    }

    prices = {}

    for name, ticker in commodities.items():
        data = yf.Ticker(ticker)
        hist = data.history(period="1d")
        if not hist.empty:
            prices[name] = round(hist["Close"][-1], 2)

    return prices

def get_exchange():
    currency_pairs = {
        "USD to EUR": "EUR=X",
        "USD to INR": "INR=X"
    }

    exchange_rates = {}
    for pair, ticker in currency_pairs.items():
        data = yf.Ticker(ticker)
        hist = data.history(period="1d")
        if not hist.empty:
            exchange_rates[pair] = round(hist["Close"][-1], 2)

    return exchange_rates

def get_macro_economic_indicators():
    sp500 = yf.Ticker("^GSPC").history(period="1y")
    gdp_growth = (sp500['Close'].iloc[-1] - sp500['Close'].iloc[0]) / sp500['Close'].iloc[0] * 100

    tips = yf.Ticker("TIP").history(period="1y")
    tnx = yf.Ticker("^TNX").history(period="1d")

    inflation_rate = 1.55
    unemployment_rate = 5.2
    interest_rate = 6.0

    return {
        "GDP_growth_rate": round(gdp_growth, 2),
        "inflation_rate": round(inflation_rate, 2) if inflation_rate else None,
        "unemployment_rate": unemployment_rate,
        "interest_rate": round(interest_rate, 2) if interest_rate else None
    }


def get_events():
    googlenews = GoogleNews(lang='en', region='IN')
    googlenews.search("India regulation OR policy OR interest rate OR ESG")

    results = googlenews.results()

    analyzer = SentimentIntensityAnalyzer()
    regulatory_events = []

    for item in results[:20]:
        title = item.get("title", "")
        desc = item.get("desc", "")

        sentiment = analyzer.polarity_scores(title + " " + desc)["compound"]
        impact = "positive" if sentiment > 0.05 else "negative" if sentiment < -0.05 else "moderate"

        regulatory_events.append({
            "event": title,
            "impact": impact
        })

    return ({"regulatory_events": regulatory_events})

# Making the input json format

def get ( name, age, location, occupation, investment_experience, goal_type, target_amount, target_years, risk_tolerance, volatility_tolerance, portfolio_style, preferred_sectors, excluded_sectors, initial_investment, liquidity_needs_percentage ):
    portfolio_request = {
    "user_profile": {
        "personal_info": {
            "name": name,
            "age": age,
            "location": location,
            "occupation": occupation,
            "investment_experience": investment_experience
        },
        "financial_goals": {
            "goal_type": goal_type,
            "target_amount": target_amount,
            "target_years": target_years
        },
        "risk_profile": {
            "risk_tolerance": risk_tolerance,
            "volatility_tolerance": volatility_tolerance
        },
        "investment_preferences": {
            "portfolio_style": portfolio_style,
            "preferred_sectors": preferred_sectors,
            "excluded_sectors": excluded_sectors,
            "preferred_asset_classes": ["Stocks", "ETFs"],
            "excluded_asset_classes": ["Cryptocurrency"]
        },
        "capital": {
            "initial_investment": initial_investment,
            "liquidity_needs_percentage": liquidity_needs_percentage
        },
        "constraints": {
            "max_allocation_per_asset": 10,
            "min_allocation_per_sector": 5,
            "max_allocation_per_sector": 30
        }
    },
    "market_data": {
        "timestamp": datetime.utcnow().isoformat() + 'Z',
        "market_conditions": {
            "market_state": market_conditions(),
            "volatility_index": volatility_index(),
        },
        "macro_economic_indicators": get_macro_economic_indicators(),
        "sector_data": sector_data(),
        "sentiment_analysis": {
            "news_sentiment_score": news_sentiment(),
        },
        "commodity_prices": get_commidities(),
        "currency_exchange_rates": get_exchange(),
        "regulatory_events": get_events()
    },
    "portfolio_constraints": {
        "max_total_risk": 0.15,
        "min_liquidity_percentage": 15,
        "sector_diversification": True,
        "max_individual_asset_percentage": 10
    },
    "model_preferences": {
        "optimization_goal": "maximize risk-adjusted return",
        "time_horizon": goal_type,
        "explanation_level": "detailed",
        "adaptation": True
    } }
    
    return portfolio_request
