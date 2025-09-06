@echo off
echo Installing Super Tools Dashboard improvements...

echo.
echo 1. Installing testing and performance tools...
npm install -D @playwright/test @testing-library/react @testing-library/jest-dom
npm install -D lighthouse web-vitals eslint-plugin-security prettier

echo.
echo 2. Installing enhanced React components...
npm install react-error-boundary react-helmet-async

echo.
echo 3. Installing Playwright browsers...
npx playwright install chromium

echo.
echo 4. Setting up performance monitoring...
npm install -D workbox-webpack-plugin

echo.
echo ✅ All improvements installed successfully!
echo.
echo Next steps:
echo - Run: npm run test:tools (to test all tools)
echo - Run: npm run lighthouse (to check performance)
echo - Run: npm run security-check (to scan for vulnerabilities)
echo.
pause