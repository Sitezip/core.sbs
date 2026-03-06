# Installation Guide

## Quick Install

### Windows
```bash
curl -sSL https://raw.githubusercontent.com/Sitezip/core.sbs/main/install.bat | cmd
```

### Mac/Linux
```bash
curl -sSL https://raw.githubusercontent.com/Sitezip/core.sbs/main/install.sh | bash
```

## What Gets Installed

The installer sets up three CLI tools globally:

- **create-core-app** - Scaffold new core.js projects
- **core-gen** - Generate pre-built components  
- **core-dev** - Development server with hot reload

## Manual Installation

If you prefer manual setup or the installer doesn't work:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sitezip/core.sbs.git
   cd core.sbs
   ```

2. **Install dependencies for each CLI tool**
   ```bash
   cd cli/create-core-app && npm install
   cd ../core-gen && npm install
   cd ../core-dev && npm install
   cd ../..
   ```

3. **Create global symlinks**
   ```bash
   # Mac/Linux
   ln -sf "$(pwd)/cli/create-core-app/bin/create-core-app.js" /usr/local/bin/create-core-app
   ln -sf "$(pwd)/cli/core-gen/bin/core-gen.js" /usr/local/bin/core-gen
   ln -sf "$(pwd)/cli/core-dev/bin/core-dev.js" /usr/local/bin/core-dev
   
   # Windows (run as Administrator)
   mklink "C:\Windows\System32\create-core-app.js" "%cd%\cli\create-core-app\bin\create-core-app.js"
   mklink "C:\Windows\System32\core-gen.js" "%cd%\cli\core-gen\bin\core-gen.js"
   mklink "C:\Windows\System32\core-dev.js" "%cd%\cli\core-dev\bin\core-dev.js"
   ```

## Requirements

- **Node.js** (version 14 or higher)
- **curl** or **wget** (for quick install)
- **Git** (for manual installation)

## Verify Installation

Run these commands to verify everything is working:

```bash
create-core-app --version
core-gen --version
core-dev --version
```

## Getting Started

After installation:

1. **Create a new project**
   ```bash
   create-core-app my-app
   cd my-app
   ```

2. **Start development server**
   ```bash
   core-dev
   ```

3. **Open your browser**
   Navigate to http://localhost:3000

## Troubleshooting

### Command not found

If you get "command not found" errors:

**Mac/Linux:**
```bash
echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.bashrc
source ~/.bashrc
```

**Windows:**
Restart your command prompt or run:
```cmd
set PATH=%PATH%;%USERPROFILE%\.core-sbs\bin
```

### Permission denied

**Mac/Linux:**
```bash
chmod +x ~/.core-sbs/*
```

**Windows:**
Run the installer as Administrator.

### Network issues

If the installer fails due to network issues, try manual installation.

## Uninstall

To remove the CLI tools:

**Mac/Linux:**
```bash
rm -rf ~/.core-sbs
rm -f ~/.local/bin/create-core-app
rm -f ~/.local/bin/core-gen
rm -f ~/.local/bin/core-dev
```

**Windows:**
```cmd
rmdir /s "%USERPROFILE%\.core-sbs"
del "C:\Windows\System32\create-core-app.js"
del "C:\Windows\System32\core-gen.js"
del "C:\Windows\System32\core-dev.js"
```

## Next Steps

- Read the [main documentation](README.md)
- Check out the [CLI tools guide](INDEX.md#-cli-tools)
- Visit the [interactive docs](https://core.sbs/docs.html)
