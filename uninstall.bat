@echo off
REM core.sbs CLI Tools Uninstaller for Windows
REM Removes all CLI tools and configuration

echo 🗑️  Uninstalling core.sbs CLI tools...

REM Configuration
set INSTALL_DIR=%USERPROFILE%\.core-sbs
set BIN_DIR=%USERPROFILE%\.core-sbs\bin

REM Remove installation directory
if exist "%INSTALL_DIR%" (
    echo [INFO] Removing installation directory: %INSTALL_DIR%
    rmdir /s /q "%INSTALL_DIR%"
    echo [SUCCESS] Installation directory removed
) else (
    echo [WARNING] Installation directory not found: %INSTALL_DIR%
)

REM Remove CLI tools from bin directory
if exist "%BIN_DIR%\create-core-app.bat" (
    echo [INFO] Removing create-core-app
    del "%BIN_DIR%\create-core-app.bat"
    echo [SUCCESS] create-core-app removed
)

if exist "%BIN_DIR%\core-gen.bat" (
    echo [INFO] Removing core-gen
    del "%BIN_DIR%\core-gen.bat"
    echo [SUCCESS] core-gen removed
)

if exist "%BIN_DIR%\core-dev.bat" (
    echo [INFO] Removing core-dev
    del "%BIN_DIR%\core-dev.bat"
    echo [SUCCESS] core-dev removed
)

REM Remove bin directory if empty
if exist "%BIN_DIR%" (
    dir /b "%BIN_DIR%" | findstr /r "." >nul
    if errorlevel 1 (
        echo [INFO] Removing empty bin directory
        rmdir "%BIN_DIR%"
    )
)

REM Remove from PATH
echo [INFO] Removing from PATH...
REM Get current PATH and remove core-sbs entries
for /f "tokens=*" %%i in ('reg query "HKCU\Environment" /v PATH 2^>nul ^| findstr "REG_"') do (
    set current_path=%%i
)

REM Remove core-sbs from PATH (this is simplified - full removal requires registry editing)
echo [INFO] Note: PATH cleanup may require manual removal of %BIN_DIR% from system environment variables
echo [INFO] You can check and edit PATH in: System Properties > Environment Variables

echo.
echo [SUCCESS] Uninstallation completed successfully!
echo.
echo [INFO] You may need to restart your command prompt for PATH changes to take effect
echo.
echo [INFO] To verify removal, try:
echo     create-core-app --help
echo     core-gen --help
echo     core-dev --help
echo.
echo ✅ All core.sbs CLI tools have been removed

pause
