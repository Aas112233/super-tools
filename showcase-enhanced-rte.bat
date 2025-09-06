@echo off
echo Enhanced Rich Text Editor Showcase
echo ==================================
echo This script will open the enhanced Rich Text Editor in your browser
echo and demonstrate its new design features.
echo.

cd /d "c:\Users\mhass\Desktop\super-tools"
node playwright-scripts/showcase-enhanced-rich-text-editor.js

echo.
echo Press any key to close this window...
pause >nul