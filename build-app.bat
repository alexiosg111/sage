@echo off
echo BUILDING SAGE ADMIN DESKTOP APP (SETUP.EXE)...
call pnpm --filter admin dist
echo.
echo IF SUCCESSFUL, YOUR SETUP.EXE IS IN: apps\admin\dist\
pause
