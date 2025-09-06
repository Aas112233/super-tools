@echo off
echo Running check-all-tools Playwright script...
echo This will check all tool screens for proper loading
echo Make sure the development server is running on http://localhost:5175
echo.

cd /d "c:\Users\mhass\Desktop\super-tools"
node playwright-scripts/check-all-tools.js

echo.
echo Script execution completed.
pause