@echo off
echo Fixing Gradle Build Issues

:: 1. Stop all running Gradle daemons
echo Stopping Gradle daemons...
gradlew --stop

:: 2. Check and delete .gradle folder if it exists in the project
echo Checking and deleting .gradle folder...
IF EXIST "D:\Tap Global\BillManagementApp\android\.gradle" (
    rmdir /s /q "D:\Tap Global\BillManagementApp\android\.gradle"
    echo Deleted local .gradle folder.
) ELSE (
    echo .gradle folder does not exist locally.
)

:: 3. Check and delete global .gradle folder if it exists
echo Checking and deleting global .gradle folder...
IF EXIST "C:\Users\Naresh\.gradle" (
    rmdir /s /q "C:\Users\Naresh\.gradle"
    echo Deleted global .gradle folder.
) ELSE (
    echo .gradle folder does not exist globally.
)

:: 4. Run chkdsk on the D drive to check for disk errors
echo Running disk check on D: drive...
chkdsk /f D:

:: 5. Run Gradle clean with stacktrace in offline mode
echo Running Gradle clean in offline mode...
cd "D:\Tap Global\BillManagementApp\android"
gradlew clean --offline --stacktrace

:: 6. Provide final message
echo Finished cleaning and running Gradle clean process.
pause
