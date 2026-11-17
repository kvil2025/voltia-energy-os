"""
VOLTIA Energy OS - Development Server Launcher
"""

import sys
import os
import uvicorn

# Ensure project root is in Python path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

if __name__ == "__main__":
    print("⚡ Starting VOLTIA Energy OS Backend API on http://127.0.0.1:8000 ...")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
