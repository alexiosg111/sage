@echo off
echo STARTING SETUP FOR SAGE CLUB BERLIN...

:: Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

:: Check for pnpm
call pnpm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo pnpm is not installed. Installing pnpm...
    npm install -g pnpm
)

:: Install dependencies
echo INSTALLING DEPENDENCIES...
call pnpm install

:: Setup environment variables
echo SETTING UP ENVIRONMENT VARIABLES...

if not exist apps\web\.env.local (
    copy apps\web\.env.example apps\web\.env.local
    echo Created apps\web\.env.local
) else (
    echo apps\web\.env.local already exists
)

if not exist apps\admin\.env.local (
    copy apps\admin\.env.example apps\admin\.env.local
    echo Created apps\admin\.env.local
) else (
    echo apps\admin\.env.local already exists
)

echo.
echo SETUP COMPLETE!
echo ---------------------------------------------------
echo Next steps:
echo 1. Update the .env.local files in apps\web\ and apps\admin\ with your credentials.
echo 2. Run the SQL schema from packages\database\schema.sql in your Supabase project.
echo 3. Run 'pnpm dev' to start the development server.
echo ---------------------------------------------------
pause
