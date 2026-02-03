@echo off
echo STARTING SAGE ADMIN DESKTOP APP...
:: Check if dev server is running (basic check)
echo Ensure you have run start.bat first!
call pnpm --filter admin electron
pause
