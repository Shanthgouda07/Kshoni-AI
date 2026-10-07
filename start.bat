@echo off
title Kshoni AI - CMPDI Geological Intelligence Portal
echo ===================================================================
echo   KSHONI AI (भू-मित्र) — CMPDI & MINISTRY OF COAL PORTAL
echo   Zero-dependency portable geological AI system
echo ===================================================================
echo.
echo Starting local web server on port 8080...
echo.
start "" "http://localhost:8080"
node server.js
pause
