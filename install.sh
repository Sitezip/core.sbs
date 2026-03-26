#!/bin/bash

# core.sbs CLI Tools Installer (Cross-platform)
# Works on Linux, Mac, and Windows (Git Bash/WSL)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO="Sitezip/core.sbs"
VERSION="latest"
INSTALL_DIR="$HOME/.core-sbs"

# Detect Windows and adjust paths
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    BIN_DIR="$INSTALL_DIR/bin"
    SCRIPT_EXT=".bat"
    NODE_CMD="node"
else
    BIN_DIR="$HOME/.local/bin"
    SCRIPT_EXT=""
    NODE_CMD="node"
fi

# Create directories
mkdir -p "$INSTALL_DIR"
mkdir -p "$BIN_DIR"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to detect OS and architecture
detect_platform() {
    OS="$(uname -s)"
    ARCH="$(uname -m)"
    
    case "$OS" in
        Darwin)
            if [[ "$ARCH" == "arm64" ]]; then
                echo "darwin-arm64"
            else
                echo "darwin-x64"
            fi
            ;;
        Linux)
            if [[ "$ARCH" == "aarch64" ]]; then
                echo "linux-arm64"
            elif [[ "$ARCH" == "armv7l" ]]; then
                echo "linux-armv7"
            else
                echo "linux-x64"
            fi
            ;;
        MINGW*|MSYS*|CYGWIN*|WIN32*)
            echo "windows-x64"
            ;;
        *)
            print_error "Unsupported OS: $OS"
            exit 1
            ;;
    esac
}

# Function to download CLI tool
download_cli() {
    local tool_name="$1"
    local platform="$2"
    local download_url="https://raw.githubusercontent.com/$REPO/main/cli/$tool_name/bin/$tool_name.js"
    
    print_status "Downloading $tool_name..."
    
    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$download_url" -o "$INSTALL_DIR/$tool_name.js"
    elif command -v wget >/dev/null 2>&1; then
        wget -q "$download_url" -O "$INSTALL_DIR/$tool_name.js"
    else
        print_error "Neither curl nor wget is available"
        exit 1
    fi
    
    # Make executable
    chmod +x "$INSTALL_DIR/$tool_name.js"
    
    # Create wrapper script or symlink
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        # Windows: Create both .bat wrapper and bash wrapper
        # Batch wrapper for cmd.exe
        cat > "$BIN_DIR/$tool_name.bat" << EOF
@echo off
"$NODE_CMD" "$INSTALL_DIR/$tool_name.js" %*
EOF
        
        # Bash wrapper for Git Bash/MSYS
        cat > "$BIN_DIR/$tool_name" << EOF
#!/bin/bash
exec node "$INSTALL_DIR/$tool_name.js" "\$@"
EOF
        chmod +x "$BIN_DIR/$tool_name"
        
        print_success "$tool_name wrappers created (.bat and bash)"
    else
        # Unix: Create symlink
        ln -sf "$INSTALL_DIR/$tool_name.js" "$BIN_DIR/$tool_name"
        print_success "$tool_name symlink created"
    fi
}

# Function to check if Node.js is available
check_node() {
    # Try multiple methods to find node
    if ! command -v node >/dev/null 2>&1 && ! which node >/dev/null 2>&1 && ! type node >/dev/null 2>&1; then
        print_error "Node.js not found. Attempting to install..."
        
        # Detect OS and try to install Node.js
        if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
            print_status "Windows detected. Please download and install Node.js from:"
            print_status "https://nodejs.org/"
            print_status "After installation, restart your terminal and run this script again."
            exit 1
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            print_status "macOS detected. Installing Node.js via Homebrew..."
            if command -v brew >/dev/null 2>&1; then
                brew install node
            else
                print_error "Homebrew not found. Please install Node.js from https://nodejs.org/"
                exit 1
            fi
        else
            print_status "Linux detected. Attempting to install Node.js..."
            if command -v apt-get >/dev/null 2>&1; then
                curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                sudo apt-get install -y nodejs
            elif command -v yum >/dev/null 2>&1; then
                curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
                sudo yum install -y nodejs npm
            elif command -v dnf >/dev/null 2>&1; then
                curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
                sudo dnf install -y nodejs npm
            else
                print_error "Package manager not found. Please install Node.js from https://nodejs.org/"
                exit 1
            fi
        fi
        
        # Verify installation
        if ! command -v node >/dev/null 2>&1; then
            print_error "Node.js installation failed. Please install manually from https://nodejs.org/"
            exit 1
        fi
    fi
    
    local node_version=$(node --version | cut -d'v' -f2)
    print_status "Node.js version: $node_version"
}

# Function to add to PATH
add_to_path() {
    local shell_file=""
    
    # Detect shell
    if [[ -n "$BASH_VERSION" ]]; then
        shell_file="$HOME/.bashrc"
    elif [[ -n "$ZSH_VERSION" ]]; then
        shell_file="$HOME/.zshrc"
    else
        shell_file="$HOME/.profile"
    fi
    
    # Check if BIN_DIR is already in PATH
    if echo ":$PATH:" | grep -q ":$BIN_DIR:"; then
        print_status "Installation directory already in PATH"
        return
    fi
    
    print_status "Adding $BIN_DIR to PATH in $shell_file"
    echo "" >> "$shell_file"
    echo "# core.sbs CLI tools" >> "$shell_file"
    echo "export PATH=\"\$PATH:$BIN_DIR\"" >> "$shell_file"
    
    # Add to current session immediately
    export PATH="$PATH:$BIN_DIR"
    
    print_success "Added to PATH. Tools are now available in this session and future sessions."
}

# Main installation
main() {
    print_status "Installing core.sbs CLI tools..."
    
    # Check prerequisites
    check_node
    
    # Detect platform
    local platform=$(detect_platform)
    print_status "Detected platform: $platform"
    
    # Download CLI tools
    download_cli "create-core-app" "$platform"
    download_cli "core-gen" "$platform"
    download_cli "core-dev" "$platform"
    
    # Install dependencies for core-dev
    print_status "Installing dependencies for core-dev..."
    cd "$INSTALL_DIR"
    npm install chokidar ws --silent
    cd - > /dev/null
    
    # Add to PATH
    add_to_path
    
    # Installation complete
    print_success "Installation completed successfully!"
    echo
    print_status "CLI tools installed:"
    echo "  - create-core-app: Scaffold new core.js projects"
    echo "  - core-gen: Generate pre-built components"
    echo "  - core-dev: Development server with hot reload"
    echo
    print_status "Quick start:"
    echo "  create-core-app my-app"
    echo "  cd my-app"
    echo "  core-dev"
    echo
    print_warning "Tools are now available in this session!"
    print_warning "For full functionality, please restart your terminal."
}

# Run installation
main "$@"
