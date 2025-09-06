@echo off
echo Rich Text Editor Showcase
echo =========================
echo This script will open the MS Word 2021 Style Rich Text Editor in your browser
echo and demonstrate its features.
echo.

cd /d "c:\Users\mhass\Desktop\super-tools"
node playwright-scripts/showcase-rich-text-editor.js

echo.
echo Press any key to close this window...
pause >nul