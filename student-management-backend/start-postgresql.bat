@echo off
echo Starting PostgreSQL Server...
echo.

:: Method 1: Using Windows Services
echo Method 1: Starting via Windows Services
net start postgresql
echo.

:: Method 2: Using pgAdmin 4
echo Method 2: If you have pgAdmin, open it and start the server

:: Method 3: Check if PostgreSQL is installed
echo.
echo Checking PostgreSQL installation...
where pg_ctlcluster
where pg_lsclusters

echo.
echo If none of the above worked, you may need to:
echo 1. Install PostgreSQL from https://www.postgresql.org/download/windows/
echo 2. Or start the service via: services.msc
echo 3. Look for "postgresql-x64-XX" service and start it

echo.
pause