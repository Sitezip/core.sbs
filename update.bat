@echo off
setlocal enabledelayedexpansion

REM core.sbs CLI Tools Updater for Windows
REM Updates create-core-app, core-gen, and core-dev globally

echo [INFO] Updating core.sbs CLI tools...

REM Configuration
set REPO=Sitezip/core.sbs
set INSTALL_DIR=%USERPROFILE%\.core-sbs
set BIN_DIR=%USERPROFILE%\.core-sbs\bin

REM Create directories
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
if not exist "%BIN_DIR%" mkdir "%BIN_DIR%"

REM Function to download CLI tool
:download_cli
set tool_name=%1
set download_url=https://raw.githubusercontent.com/%REPO%/main/cli/%tool_name%/bin/%tool_name%.js

echo [INFO] Updating %tool_name%...

REM Check if curl is available
where curl >nul 2>nul
if %errorlevel% equ 0 (
    curl -fsSL "%download_url%" -o "%INSTALL_DIR%\%tool_name%.js"
) else (
    REM Check if wget is available
    where wget >nul 2>nul
    if %errorlevel% equ 0 (
        wget -q "%download_url%" -O "%INSTALL_DIR%\%tool_name%.js"
    ) else (
        echo [ERROR] Neither curl nor wget is available
        echo Please install curl or wget and try again
        pause
        exit /b 1
    )
)

echo [SUCCESS] %tool_name% updated successfully
goto :eof

REM Function to check Node.js
:check_node
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is required but not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set node_version=%%i
echo [INFO] Node.js version: %node_version%
goto :eof

REM Function to create wrapper scripts
:create_wrappers
echo [INFO] Creating wrapper scripts...

REM create-core-app.bat
echo @echo off > "%BIN_DIR%\create-core-app.bat"
echo node "%INSTALL_DIR%\create-core-app.js" %%* >> "%BIN_DIR%\create-core-app.bat"

REM core-gen.bat
echo @echo off > "%BIN_DIR%\core-gen.bat"
echo node "%INSTALL_DIR%\core-gen.js" %%* >> "%BIN_DIR%\core-gen.bat"

REM core-dev.bat
echo @echo off > "%BIN_DIR%\core-dev.bat"
echo node "%INSTALL_DIR%\core-dev.js" %%* >> "%BIN_DIR%\core-dev.bat"

echo [SUCCESS] Wrapper scripts updated
goto :eof

REM Function to add to PATH
:add_to_path
REM Check if BIN_DIR is already in PATH
echo %PATH% | findstr /C:"%BIN_DIR%" >nul
if %errorlevel% equ 0 (
    echo [INFO] Installation directory already in PATH
    goto :eof
)

echo [INFO] Adding %BIN_DIR% to PATH...

REM Add to current session
set PATH=%PATH%;%BIN_DIR%

REM Add to permanent PATH for future sessions
setx PATH "%PATH%" >nul 2>&1

echo [SUCCESS] PATH updated permanently
echo [INFO] Tools are now available in this session and future sessions
echo.
goto :eof

REM Function to update all tools
:update_all
REM Check prerequisites
call :check_node

REM Download CLI tools
call :download_cli create-core-app
call :download_cli core-gen
call :download_cli core-dev

REM Create wrapper scripts
call :create_wrappers

REM Add to PATH
call :add_to_path

REM Update complete
echo.
echo [SUCCESS] Update completed successfully!
echo.
echo [INFO] CLI tools updated:
echo   - create-core-app: Scaffold new core.js projects
echo   - core-gen: Generate pre-built components
echo   - core-dev: Development server with hot reload
echo.
echo [WARNING] Tools are now updated and ready to use!
echo [WARNING] For full functionality, please restart your terminal.
echo.
goto :eof

REM Function to update specific tool
:update_tool
set tool_name=%1

REM Check prerequisites
call :check_node

REM Download specific tool
call :download_cli %tool_name%

REM Create wrapper script for specific tool
if "%tool_name%"=="create-core-app" (
    echo @echo off > "%BIN_DIR%\create-core-app.bat"
    echo node "%INSTALL_DIR%\create-core-app.js" %%* >> "%BIN_DIR%\create-core-app.bat"
    echo [SUCCESS] create-core-app wrapper updated
)

if "%tool_name%"=="core-gen" (
    echo @echo off > "%BIN_DIR%\core-gen.bat"
    echo node "%INSTALL_DIR%\core-gen.js" %%* >> "%BIN_DIR%\core-gen.bat"
    echo [SUCCESS] core-gen wrapper updated
)

if "%tool_name%"=="core-dev" (
    echo @echo off > "%BIN_DIR%\core-dev.bat"
    echo node "%INSTALL_DIR%\core-dev.js" %%* >> "%BIN_DIR%\core-dev.bat"
    echo [SUCCESS] core-dev wrapper updated
    
    REM Install dependencies for core-dev
    echo [INFO] Updating dependencies for core-dev...
    cd "%INSTALL_DIR%"
    npm install chokidar ws --silent
    cd >nul
)

REM Add to PATH
call :add_to_path

echo.
echo [SUCCESS] %tool_name% updated successfully!
echo [WARNING] For full functionality, please restart your terminal.
echo.
goto :eof

REM Function to display help
:show_help
echo core.sbs CLI Tools Updater
echo.
echo Usage: %0 [tool]
echo.
echo Tools:
echo   create-core-app    Update create-core-app only
echo   core-gen           Update core-gen only
echo   core-dev           Update core-dev only
echo   (no argument)      Update all tools
echo.
echo Examples:
echo   %0                 Update all tools
echo   %0 core-gen        Update core-gen only
echo   %0 core-dev        Update core-dev only
echo.
goto :eof

REM Main update logic
:main
set tool_name=%1

if "%tool_name%"=="create-core-app" (
    call :update_tool create-core-app
) else if "%tool_name%"=="core-gen" (
    call :update_tool core-gen
) else if "%tool_name%"=="core-dev" (
    call :update_tool core-dev
) else if "%tool_name%"=="-h" (
    call :show_help
) else if "%tool_name%"=="--help" (
    call :show_help
) else if "%tool_name%"=="" (
    call :update_all
) else (
    echo [ERROR] Unknown tool: %tool_name%
    echo.
    call :show_help
    pause
    exit /b 1
)

pause
goto :eof

REM Run update
call :main %*
