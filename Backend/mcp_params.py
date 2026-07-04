import os
import sys
from dotenv import load_dotenv

load_dotenv(override=True)

brave_env = {"BRAVE_API_KEY": os.getenv("BRAVE_API_KEY")}
polygon_api_key = os.getenv("POLYGON_API_KEY")

# The MCP server for the Trader to read Market Data

alpaca_params = {
      "command": "uvx",
      "args": ["alpaca-mcp-server"],
      "env": {
        "ALPACA_API_KEY": os.getenv("ALPACA_API_KEY"),
        "ALPACA_SECRET_KEY": os.getenv("ALPACA_SECRET_KEY"),
          "ALPACA_TOOLSETS": "stock-data,crypto-data,options-data"
      }
    }


# The full set of MCP servers for the trader: Accounts, Push Notification and the Market



trader_mcp_server_params = [
    # {"command": "python", "args": ["accounts_server.py"]},
    # {"command": "python", "args": ["push_server.py"]},
    {"command": sys.executable, "args": ["accounts_server.py"]},
    {"command": sys.executable, "args": ["push_server.py"]},
    alpaca_params,
]
# The full set of MCP servers for the researcher: Fetch, Brave Search and Memory

def researcher_mcp_server_params(name: str):
    return [
        {"command": "uvx", "args": ["mcp-server-fetch"]},
        # {"command": "python", "args": [ "tavily_server.py"]},
        {"command": sys.executable, "args": ["tavily_server.py"]},
        {
            "command": "npx",
            "args": ["-y", "mcp-memory-libsql"],
            "env": {"LIBSQL_URL": f"file:./memory/{name}.db"},
        },
    ]
