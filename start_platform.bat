@echo off
title VOLTIA // ENERGY OS - Launcher
echo ==============================================================================
echo                 VOLTIA // ENERGY OS (SEN CHILE MKT INTELLIGENCE)
echo        Institutional Alternative to Aurora Energy Research (EOS / Chronos)
echo ==============================================================================
echo.
echo [1/3] Iniciando Backend Cuantitativo FastAPI (Puerto 8000)...
start "VOLTIA API Backend" cmd /k "cd /d %~dp0backend && python run_server.py"

echo [2/3] Iniciando Frontend React Apple HIG + Vite (Puerto 5173)...
start "VOLTIA Frontend OS" cmd /k "cd /d %~dp0frontend && npm run dev"

echo [3/3] Abriendo navegador...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ==============================================================================
echo Plataforma en ejecucion:
echo - Frontend OS:      http://localhost:5173
echo - Standalone Intro: %~dp0frontend\public\intro_preview.html
echo - Backend FastAPI:  http://localhost:8000/docs
echo ==============================================================================
echo Presione cualquier tecla para cerrar este asistente (los servicios seguiran corriendo).
pause >nul
