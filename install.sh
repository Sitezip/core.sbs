#!/bin/bash

# core.sbs CLI Tools Installer
# Installs create-core-app, core-gen, and core-dev globally

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
BIN_DIR="$HOME/.local/bin"

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
        curl -fsSL "$download_url" -o "$INSTALL_DIR/$tool_name"
    elif command -v wget >/dev/null 2>&1; then
        wget -q "$download_url" -O "$INSTALL_DIR/$tool_name"
    else
        print_error "Neither curl nor wget is available"
        exit 1
    fi
    
    # Make executable
    chmod +x "$INSTALL_DIR/$tool_name"
    
    # Create symlink in bin directory
    ln -sf "$INSTALL_DIR/$tool_name" "$BIN_DIR/$tool_name"
    
    print_success "$tool_name installed successfully"
}

# Function to check if Node.js is available
check_node() {
    if ! command -v node >/dev/null 2>&1; then
        print_error "Node.js is required but not installed"
        print_status "Please install Node.js from https://nodejs.org/"
        exit 1
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
    
    print_success "Added to PATH. Please restart your terminal or run: source $shell_file"
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
    print_warning "Don't forget to restart your terminal or source your shell profile!"
}

# Run installation
main "$@"
