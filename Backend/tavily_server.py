import os
from dotenv import load_dotenv
import requests
from pydantic import BaseModel, Field
from mcp.server.fastmcp import FastMCP
from tavily import TavilyClient

load_dotenv(override=True)

tavily_api_key = os.getenv("TAVILY_API_KEY")
tavily=TavilyClient(api_key=tavily_api_key)

mcp = FastMCP("tavily_server")


class TavilyArgs(BaseModel):
    query: str = Field(description="query to search for")


@mcp.tool()
def search(args:TavilyArgs):
    """Search for a query using Tavily and return the results"""
    result=tavily.search(query=args.query,max_results=3)
    return result

if __name__ == "__main__":
    mcp.run(transport="stdio")
