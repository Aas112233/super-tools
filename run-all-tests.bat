@echo off
echo 🚀 Running Super Tools Dashboard Test Suite...

echo.
echo 1. Checking component exports...
node quick-tools-check.js

echo.
echo 2. Running Playwright tests...
npm run test:tools

echo.
echo 3. Running security check...
npm run security-check

echo.
echo 4. Checking code formatting...
npm run format

echo.
echo ✅ All tests completed!
echo Check the generated reports for detailed results.
pause